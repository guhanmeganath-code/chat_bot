import sqlite3 from "sqlite3";
import path from "path";
import { INDIAN_LAW_CORPUS } from "./seed_data.js";

const dbPath = path.resolve(process.cwd(), "database.db");

// Custom promise wrapper for sqlite3 Database
export class SQLiteDatabase {
  private db: sqlite3.Database | null = null;

  constructor() {
    // Open SQLite database
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Failed to open SQLite database:", err.message);
      } else {
        console.log("Connected to SQLite database at:", dbPath);
      }
    });
  }

  // Helper to run query with no results returned (INSERT, UPDATE, CREATE TABLE)
  run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db?.run(sql, params, function (this: sqlite3.RunResult, err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Helper to get a single row
  get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db?.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as T);
        }
      });
    });
  }

  // Helper to get all rows
  all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db?.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as T[]);
        }
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db?.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

// Global Singleton Instance
export const db = new SQLiteDatabase();

export interface DbSession {
  id: string;
  created_at: string;
}

export interface DbChat {
  id: number;
  session_id: string;
  user_message: string;
  bot_response: string; // Stored as a raw / stringified JSON string
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

// Initializer to bootstrap SQLite schema and seed Indian law corpus safely
export async function initDb(): Promise<void> {
  console.log("Initializing database tables...");

  // 1. Create sessions table
  await db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Create chats table mapped to sessions
  await db.run(`
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

  // 3. Create law_sections table
  await db.run(`
    CREATE TABLE IF NOT EXISTS law_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      act TEXT,
      section_number TEXT,
      title TEXT,
      summary TEXT,
      keywords TEXT
    )
  `);

  // Check if we already have seed data in law_sections
  const countRow = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM law_sections");
  if (countRow && countRow.count === 0) {
    console.log("Seeding Indian law corpus reference definitions...");
    for (const section of INDIAN_LAW_CORPUS) {
      await db.run(
        `INSERT INTO law_sections (act, section_number, title, summary, keywords) VALUES (?, ?, ?, ?, ?)`,
        [section.act, section.section_number, section.title, section.summary, section.keywords]
      );
    }
    console.log(`Seeded ${INDIAN_LAW_CORPUS.length} common law sections successfully.`);
  } else {
    console.log(`Law sections table count check: ${countRow?.count || 0} items already exist.`);
  }
}

// Create a new session with custom or UUID format
export async function createSession(customId?: string): Promise<string> {
  const sessionId = customId || `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
  await db.run("INSERT INTO sessions (id) VALUES (?)", [sessionId]);
  return sessionId;
}

// Validate if session exists
export async function validateSession(sessionId: string): Promise<boolean> {
  const session = await db.get<DbSession>("SELECT id FROM sessions WHERE id = ?", [sessionId]);
  return !!session;
}

// Store a single exchange
export async function saveChat(
  sessionId: string,
  userMessage: string,
  botResponseJson: string,
  confidence: "grounded" | "general"
): Promise<void> {
  await db.run(
    `INSERT INTO chats (session_id, user_message, bot_response, confidence) VALUES (?, ?, ?, ?)`,
    [sessionId, userMessage, botResponseJson, confidence]
  );
}

// Retrieve paginated historical chat list reversed / chronologically sorted
export async function getHistory(sessionId: string, limit: number = 20, offset: number = 0): Promise<DbChat[]> {
  return db.all<DbChat>(
    `SELECT id, session_id, user_message, bot_response, confidence, timestamp 
     FROM chats 
     WHERE session_id = ? 
     ORDER BY timestamp ASC 
     LIMIT ? OFFSET ?`,
    [sessionId, limit, offset]
  );
}

// Search Grounding Corpus using a flexible keywords ranking
export async function searchLawSections(query: string): Promise<DbLawSection[]> {
  if (!query || query.trim() === "") return [];

  // Parse terms to search against keywords & summaries
  const terms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 2); // Filter out tiny words like is, an, to, etc.

  if (terms.length === 0) return [];

  const allSections = await db.all<DbLawSection>("SELECT * FROM law_sections");

  // Multi-term dynamic keyword matcher ranking
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
        if (index === 0) weight = 4; // Title match
        if (index === 3) weight = 5; // Section Code match
        if (index === 2) weight = 2; // Keyword list match

        if (target.includes(term)) {
          score += weight;
        }
      });
    });

    return { section, score };
  });

  // Sort and filter out non-matching rows, return top 4 matches
  return results
    .filter((v) => v.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((v) => v.section)
    .slice(0, 4);
}
