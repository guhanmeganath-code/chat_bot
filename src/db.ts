import initSqlJs, { Database } from "sql.js";
import fs from "fs";
import path from "path";
import { INDIAN_LAW_CORPUS } from "./seed_data.js";

const dbPath = path.resolve(process.cwd(), "database.db");

// Locate the sql-wasm.wasm file (works in both dev and production builds)
function findWasmFile(): Uint8Array | undefined {
  const candidates = [
    path.join(process.cwd(), "dist", "sql-wasm.wasm"),    // production: in dist/
    path.join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm"), // dev: in node_modules
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return fs.readFileSync(candidate);
    }
  }
  return undefined;
}

// Global database reference (set after async init)
let db: Database;

// Helper: save the in-memory database to disk
function saveToDisk(): void {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

export interface DbSession {
  id: string;
  created_at: string;
}

export interface DbChat {
  id: number;
  session_id: string;
  user_message: string;
  bot_response: string;
  confidence: "grounded" | "general";
  timestamp: string;
}

export interface DbLawSection {
  id: number;
  act: string;
  section_number: string;
  title: string;
  summary: string;
  keywords: string;
}

// Initializer: load existing DB from disk or create new one, then bootstrap schema
export async function initDb(): Promise<void> {
  console.log("Initializing database...");

  const wasmBinary = findWasmFile();
  const SQL = await initSqlJs(wasmBinary ? { wasmBinary } : {});

  // Load existing database file if it exists
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
    console.log("Loaded existing SQLite database at:", dbPath);
  } else {
    db = new SQL.Database();
    console.log("Created new in-memory SQLite database");
  }

  console.log("Initializing database tables...");

  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT,
      user_message TEXT,
      bot_response TEXT,
      confidence TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS law_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      act TEXT,
      section_number TEXT,
      title TEXT,
      summary TEXT,
      keywords TEXT
    )
  `);

  // Check if we already have seed data
  const countResult = db.exec("SELECT COUNT(*) as count FROM law_sections");
  const count = countResult.length > 0 ? (countResult[0].values[0][0] as number) : 0;

  if (count === 0) {
    console.log("Seeding Indian law corpus reference definitions...");
    const stmt = db.prepare(
      "INSERT INTO law_sections (act, section_number, title, summary, keywords) VALUES (?, ?, ?, ?, ?)"
    );
    for (const section of INDIAN_LAW_CORPUS) {
      stmt.run([section.act, section.section_number, section.title, section.summary, section.keywords]);
    }
    stmt.free();
    console.log(`Seeded ${INDIAN_LAW_CORPUS.length} common law sections successfully.`);
    saveToDisk();
  } else {
    console.log(`Law sections table count check: ${count} items already exist.`);
  }
}

// Create a new session
export async function createSession(customId?: string): Promise<string> {
  const sessionId = customId || `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
  db.run("INSERT INTO sessions (id) VALUES (?)", [sessionId]);
  saveToDisk();
  return sessionId;
}

// Validate if session exists
export async function validateSession(sessionId: string): Promise<boolean> {
  const result = db.exec("SELECT id FROM sessions WHERE id = ?", [sessionId]);
  return result.length > 0 && result[0].values.length > 0;
}

// Store a single exchange
export async function saveChat(
  sessionId: string,
  userMessage: string,
  botResponseJson: string,
  confidence: "grounded" | "general"
): Promise<void> {
  db.run(
    "INSERT INTO chats (session_id, user_message, bot_response, confidence) VALUES (?, ?, ?, ?)",
    [sessionId, userMessage, botResponseJson, confidence]
  );
  saveToDisk();
}

// Retrieve paginated historical chat list
export async function getHistory(sessionId: string, limit: number = 20, offset: number = 0): Promise<DbChat[]> {
  const result = db.exec(
    `SELECT id, session_id, user_message, bot_response, confidence, timestamp 
     FROM chats 
     WHERE session_id = ? 
     ORDER BY timestamp ASC 
     LIMIT ? OFFSET ?`,
    [sessionId, limit, offset]
  );

  if (result.length === 0) return [];

  const columns = result[0].columns;
  return result[0].values.map((row) => {
    const obj: any = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj as DbChat;
  });
}

// Search Grounding Corpus using flexible keywords ranking
export async function searchLawSections(query: string): Promise<DbLawSection[]> {
  if (!query || query.trim() === "") return [];

  const terms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 2);

  if (terms.length === 0) return [];

  const result = db.exec("SELECT * FROM law_sections");
  if (result.length === 0) return [];

  const columns = result[0].columns;
  const allSections: DbLawSection[] = result[0].values.map((row) => {
    const obj: any = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj as DbLawSection;
  });

  const results = allSections.map((section) => {
    let score = 0;
    const targets = [
      section.title.toLowerCase(),
      section.summary.toLowerCase(),
      section.keywords.toLowerCase(),
      section.section_number.toLowerCase(),
      section.act.toLowerCase()
    ];

    terms.forEach((term) => {
      targets.forEach((target, index) => {
        let weight = 1;
        if (index === 0) weight = 4;
        if (index === 3) weight = 5;
        if (index === 2) weight = 2;

        if (target.includes(term)) {
          score += weight;
        }
      });
    });

    return { section, score };
  });

  return results
    .filter((v) => v.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((v) => v.section)
    .slice(0, 4);
}
