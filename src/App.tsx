/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import ChatInterface from "./components/ChatInterface";
import { Language, Message, ChatSession, FileAttachment } from "./types";

export default function App() {
  const [view, setView] = useState<"landing" | "chat">("landing");
  const [language, setLanguage] = useState<Language>("en");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [sessionsList, setSessionsList] = useState<ChatSession[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Initialize session state on component mount
  useEffect(() => {
    const initializeSession = async () => {
      // 1. Load active session ID if stored
      const storedSessionId = localStorage.getItem("lawbot_current_session_id");
      
      // 2. Load list of sessions this client created
      const storedSessionsJson = localStorage.getItem("lawbot_sessions_list");
      let activeSessions: ChatSession[] = [];
      
      if (storedSessionsJson) {
        try {
          activeSessions = JSON.parse(storedSessionsJson);
          setSessionsList(activeSessions);
        } catch (e) {
          console.error("Failed to parse local sessions log, resetting:", e);
        }
      }

      // If we have an existing session, validate it; otherwise create new
      if (storedSessionId) {
        const valid = await validateSessionOnServer(storedSessionId);
        if (valid) {
          setSessionId(storedSessionId);
          await triggerHistoryFetch(storedSessionId);
        } else {
          // Session expired (server likely restarted) — create fresh one
          console.warn("Stored session expired, creating new session.");
          localStorage.removeItem("lawbot_current_session_id");
          await triggerNewSessionCreation(activeSessions);
        }
      } else {
        // Create a default session on boot so chatbot is ready
        await triggerNewSessionCreation(activeSessions);
      }
    };

    initializeSession();
  }, []);

  // Set visual theme classes on body element
  useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add("dark");
      body.style.backgroundColor = "#111827"; // matches legal-dark
    } else {
      body.classList.remove("dark");
      body.style.backgroundColor = "#F9FAFB"; // matches legal-bg
    }
  }, [isDarkMode]);

  // Validate whether the server still knows about a given session
  const validateSessionOnServer = async (sessId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/history?session_id=${encodeURIComponent(sessId)}&limit=1`);
      return response.ok;
    } catch {
      return false;
    }
  };

  // Create a brand new session mapping to backend SQLite
  const triggerNewSessionCreation = async (existingList: ChatSession[] = sessionsList) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to create a verified legal session on the server.");
      }

      const data = await response.json();
      const newSessId = data.session_id;

      // Localize title by order of occurrence
      const cleanTitle = `Consultation - ${existingList.length + 1}`;
      
      const newSessionObj: ChatSession = { id: newSessId, title: cleanTitle };
      const updatedList = [newSessionObj, ...existingList];

      // Save references locally
      setSessionId(newSessId);
      localStorage.setItem("lawbot_current_session_id", newSessId);
      
      setSessionsList(updatedList);
      localStorage.setItem("lawbot_sessions_list", JSON.stringify(updatedList));

      // Reset active history state
      setHistory([]);
    } catch (err) {
      console.error("New session allocation failure:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Switch to a chosen prior session
  const selectSession = async (id: string) => {
    setSessionId(id);
    localStorage.setItem("lawbot_current_session_id", id);
    await triggerHistoryFetch(id);
  };

  // Retrieve complete conversation from API
  const triggerHistoryFetch = async (sessId: string) => {
    try {
      const response = await fetch(`/api/history?session_id=${encodeURIComponent(sessId)}`);
      if (response.ok) {
        const data = await response.json();
        // Backend maps individual bot_response JSON strings automatically
        if (data.history) {
          const formattedHistory: Message[] = data.history.map((h: any) => ({
            id: String(h.id),
            role: h.user_message ? "bot" : "user", // logic check
            raw_text: h.user_message,
            bot_response: h.bot_response,
            confidence: h.confidence,
            timestamp: h.timestamp || new Date().toISOString(),
          }));

          // Restructure chats cleanly.
          // Since history returns rows matching user message & bot response together,
          // split them back into individual user & bot messages for UI rendering.
          const splitChats: Message[] = [];
          data.history.forEach((row: any, index: number) => {
            // Push User Inquiry
            splitChats.push({
              id: `user-${row.id}-${index}`,
              role: "user",
              raw_text: row.user_message,
              timestamp: row.timestamp,
            });
            // Push Bot Grounded Reply
            splitChats.push({
              id: `bot-${row.id}-${index}`,
              role: "bot",
              bot_response: row.bot_response,
              confidence: row.confidence,
              timestamp: row.timestamp,
            });
          });

          setHistory(splitChats);
        }
      }
    } catch (err) {
      console.error("Failed to load statutory logs:", err);
    }
  };

  // Submit legal query with dynamic loading states
  const submitInquiryMessage = async (text: string, file?: FileAttachment) => {
    if (!sessionId) {
      throw new Error("Active statutory consultation session is not configured.");
    }

    // Allocate immediate local temporary ID
    const userMsgId = `temp-user-${Date.now()}`;
    const newUserMsg: Message = {
      id: userMsgId,
      role: "user",
      raw_text: text,
      timestamp: new Date().toISOString(),
      file,
    };

    // Stagger user bubble inside the view feed
    setHistory((prev) => [...prev, newUserMsg]);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          file: file || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // If session expired on server, auto-create a new one and retry
        if (response.status === 404) {
          console.warn("Session expired mid-chat, creating new session and retrying...");
          await triggerNewSessionCreation();
          // Retry with the freshly created session
          const retryResponse = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_id: localStorage.getItem("lawbot_current_session_id"),
              message: text,
            }),
          });
          if (!retryResponse.ok) {
            const retryError = await retryResponse.json();
            throw new Error(retryError.error || "Retry failed after session recovery.");
          }
          const retryOutput = await retryResponse.json();
          const retryBotMsg: Message = {
            id: `temp-bot-${Date.now()}`,
            role: "bot",
            bot_response: retryOutput,
            confidence: retryOutput.confidence,
            timestamp: new Date().toISOString(),
          };
          setHistory((prev) => [...prev, retryBotMsg]);
          return;
        }

        throw new Error(errorData.error || "The legal network experienced a processing issue.");
      }

      const botJsonOutput = await response.json();
      
      const botMsgId = `temp-bot-${Date.now()}`;
      const newBotMsg: Message = {
        id: botMsgId,
        role: "bot",
        bot_response: botJsonOutput,
        confidence: botJsonOutput.confidence,
        timestamp: new Date().toISOString(),
      };

      setHistory((prev) => [...prev, newBotMsg]);
    } catch (err: any) {
      console.error("LLM evaluation trigger failed:", err);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  // Clear session lists completely local helper
  const clearAllSessionsHistory = () => {
    localStorage.removeItem("lawbot_current_session_id");
    localStorage.removeItem("lawbot_sessions_list");
    setSessionId(null);
    setHistory([]);
    setSessionsList([]);
    triggerNewSessionCreation([]);
  };

  return (
    <div className={`min-h-screen transition-all ${isDarkMode ? "dark" : ""}`}>
      {view === "landing" ? (
        <LandingPage
          language={language}
          isDarkMode={isDarkMode}
          onStartChat={() => setView("chat")}
          setLanguage={(lang) => setLanguage(lang)}
          toggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
      ) : (
        <ChatInterface
          language={language}
          sessionId={sessionId}
          history={history}
          sessionsList={sessionsList}
          isDarkMode={isDarkMode}
          onSetLanguage={(lang) => setLanguage(lang)}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onSubmitMessage={submitInquiryMessage}
          onNewChat={() => triggerNewSessionCreation()}
          onSelectSession={selectSession}
          onBackToHome={() => setView("landing")}
          isGenerating={isGenerating}
          clearAllHistoryLocal={clearAllSessionsHistory}
        />
      )}
    </div>
  );
}

