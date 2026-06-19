import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import {
  initDb,
  createSession,
  saveChat,
  getHistory,
  searchLawSections,
  validateSession
} from "./src/db.js";

// Load environment variables, preferring local development overrides.
dotenv.config({ path: ".env.local" });
dotenv.config();

// Server-side Gemini API initialization. Keep this key in host env vars only.
const resolvedApiKey = process.env.GEMINI_API_KEY;

if (!resolvedApiKey || resolvedApiKey === "MY_GEMINI_API_KEY") {
  throw new Error("GEMINI_API_KEY is required. Set it in your hosting provider environment variables.");
}

const ai = new GoogleGenAI({
  apiKey: resolvedApiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  // Bootstrap the SQLite database
  try {
    await initDb();
    console.log("SQLite DB Initialized successfully!");
  } catch (error) {
    console.error("Failed to initialize SQLite Database:", error);
  }

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Use JSON middleware
  app.use(express.json());

  // Restrict CORS based on environment
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow same-origin and requests from allowed range
        if (!origin || origin.startsWith("http://localhost:") || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    })
  );

  // In-memory rate limiting configuration: 10 requests per minute
  const rateLimiter = new Map<string, number[]>();
  function isRateLimited(sessionId: string): boolean {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 10;

    if (!rateLimiter.has(sessionId)) {
      rateLimiter.set(sessionId, [now]);
      return false;
    }

    const timestamps = rateLimiter.get(sessionId) || [];
    // Keep only timestamps in the last minute
    const validTimestamps = timestamps.filter((ts) => now - ts < windowMs);
    if (validTimestamps.length >= maxRequests) {
      rateLimiter.set(sessionId, validTimestamps);
      return true;
    }

    validTimestamps.push(now);
    rateLimiter.set(sessionId, validTimestamps);
    return false;
  }

  // API Route: Create Session
  app.post("/api/session", async (req, res) => {
    try {
      const sessionId = await createSession();
      res.json({ session_id: sessionId });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to generate legal session: " + err.message });
    }
  });

  // API Route: Get Paginated Chat History
  app.get("/api/history", async (req, res) => {
    try {
      const sessionId = req.query.session_id as string;
      const limit = parseInt(req.query.limit as string || "20");
      const offset = parseInt(req.query.offset as string || "0");

      if (!sessionId) {
        res.status(400).json({ error: "session_id parameter is required" });
        return;
      }

      const chats = await getHistory(sessionId, limit, offset);
      // Map stored stringified JSON chats into full objects
      const history = chats.map((chat) => {
        let botResponseObj = {};
        try {
          botResponseObj = JSON.parse(chat.bot_response);
        } catch {
          botResponseObj = {
            explanation: chat.bot_response,
            section_reference: "N/A",
            example: "N/A",
            disclaimer: "This is for informational purposes only.",
            confidence: chat.confidence,
          };
        }
        return {
          id: chat.id,
          user_message: chat.user_message,
          bot_response: botResponseObj,
          confidence: chat.confidence,
          timestamp: chat.timestamp,
        };
      });

      res.json({ history });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch chat history: " + err.message });
    }
  });

  // API Route: Law Chat with Retrieval Grounding
  app.post("/api/chat", async (req, res) => {
    try {
      const { session_id, message } = req.body;

      if (!session_id) {
        res.status(400).json({ error: "session_id is required." });
        return;
      }

      if (!message || typeof message !== "string" || message.trim() === "") {
        res.status(400).json({ error: "message is required and must be non-empty." });
        return;
      }

      // Check message length limit (1000 characters)
      if (message.length > 1000) {
        res.status(400).json({ error: "Your inquiry exceeds the limit of 1000 characters." });
        return;
      }

      // Rate limit check
      if (isRateLimited(session_id)) {
        res.status(429).json({
          error: "Rate limit exceeded. You can send a maximum of 10 legal messages per minute.",
        });
        return;
      }

      // Verify the session ID is active/valid
      const sessionExists = await validateSession(session_id);
      if (!sessionExists) {
        res.status(404).json({ error: "Legal chat session not found or expired. Please start a new session." });
        return;
      }

      // Step 1: Search the `law_sections` corpus using keyword matching
      const groundingSections = await searchLawSections(message);
      const isGroundedAvailable = groundingSections.length > 0;

      // Construct retrieved context excerpt
      let retrievedContext = "";
      if (isGroundedAvailable) {
        retrievedContext = groundingSections
          .map((sec) => {
            return `ACT: ${sec.act}
SECTION: ${sec.section_number}
TITLE: ${sec.title}
SUMMARY: ${sec.summary}
KEYWORDS: ${sec.keywords}
----------------------------`;
          })
          .join("\n\n");
      } else {
        retrievedContext = "No specific relevant statutory clauses found in the local law_sections reference database.";
      }

      // Step 2: System prompt containing robust safety, grounding, and decline clauses
      const systemInstruction = `You are a professional full-stack assistant providing objective general information about Indian Law.
You cover Indian Penal Code (IPC) / Bharatiya Nyaya Sanhita (BNS), Code of Criminal Procedure (CrPC) / Bharatiya Nagarik Suraksha Sanhita (BNSS), the Constitution of India, Information Technology Act (IT Act) for cyber law, Consumer Protection Act, 2019, and the Motor Vehicles Act, 1988 (Traffic Rules).

You are provided with a grounding context containing key matching legal section summaries. Your section_reference and confidence MUST be based strictly on this context if it is relevant.
If the context is relevant and answers the query, set confidence to "grounded".
If the context does not cover the user's specific statutory query, do not hallucinate, make up fake articles, or guess random section numbers. Answer from your general knowledge of Indian Law instead, and explicitly set confidence to "general" and label the section_reference with a standard tag like "General Legal Knowledge" or similar.

CRITICAL SAFETY RULES:
You MUST decline to assist and explain why (returning the specific fallback reply below) if the user's inquiry:
1. Asks for advice or instructions on committing a crime, evading arrest, destroying legal evidence, or bribing officers.
2. Asks for specific advice on an active, ongoing personal court case (e.g., "what should I say in front of the judge tomorrow in my active property dispute?"). Redirect them politely to a licensed advocate.
3. Requests you to draft final legally-binding filings, contracts, or notices meant for direct official use.
4. Asks you to impersonate a lawyer, judge, police investigator, or government magistrate.
5. Involves foreign law outside of the Indian legal framework entirely (politely redirect to Indian jurisdictions).

If the request violates any of these rules or asks for illegal/evasive activities, you MUST reply with this exact format:
{
  "section_reference": "Forbidden / Decline Scenario",
  "explanation": "I cannot help with that request. I can give general information about Indian laws like the IPC/BNS, CrPC/BNSS, or consumer and cyber law — for anything involving your specific ongoing legal situation, please consult a licensed advocate.",
  "example": "Not applicable.",
  "disclaimer": "This chatbot provides general legal information based on publicly available statutes and is not a substitute for professional legal advice.",
  "confidence": "general"
}`;

      // Assemble final prompt for Gemini
      const prompt = `User's Legal Query: ${message}

Grounding Context Excerpts (Use for Grounding Sections):
${retrievedContext}

Provide your structured JSON response conforming strictly to the requested schema.`;

      // Step 3: Call the server-side Gemini API securely (uses gemini-3.5-flash as default)
      const rawResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              section_reference: {
                type: Type.STRING,
                description: "The specific clause citation or Section number (e.g. 'IPC Section 378 / BNS Section 303'). Use 'General Legal Knowledge' or similar if confidence is general.",
              },
              explanation: {
                type: Type.STRING,
                description: "Plain-language translation of the relevant code/rule in exactly 2-3 structured sentences.",
              },
              example: {
                type: Type.STRING,
                description: "A short, realistic, illustrative example case scenario.",
              },
              disclaimer: {
                type: Type.STRING,
                description: "A standard disclaimer stating that this is for information only and not direct legal counsel.",
              },
              confidence: {
                type: Type.STRING,
                description: "MUST be either 'grounded' or 'general' as detailed in the rules.",
              },
            },
            required: ["section_reference", "explanation", "example", "disclaimer", "confidence"],
          },
        },
      });

      const responseText = rawResponse.text?.trim() || "";
      let botResponseObj: any;

      try {
        botResponseObj = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse Gemini JSON output, raw response was:", responseText);
        // Fallback robust response object if JSON was invalid
        botResponseObj = {
          section_reference: "General Legal Reference",
          explanation: "I was able to analyze your query, but could not format the output structure strictly. Indian law provides general guidelines regarding this topic.",
          example: "Please specify. For example, local statutes define rules on this scenario.",
          disclaimer: "This is for informational purposes only and not a substitute for professional legal advice.",
          confidence: "general",
        };
      }

      // Save to database ('chats' table)
      const confidenceStatus = botResponseObj.confidence === "grounded" ? "grounded" : "general";
      await saveChat(session_id, message, JSON.stringify(botResponseObj), confidenceStatus);

      // Return response
      res.json(botResponseObj);
    } catch (err: any) {
      console.error("AI chat assistant error:", err);
      res.status(500).json({ error: "The legal server experienced an issue processing the request: " + err.message });
    }
  });

  // Serve Frontend assets after API routes
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Indian Law Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
