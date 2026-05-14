import fs from "fs/promises";
import path from "path";
import { ProcessedDocument } from "./ingestion";
import { DocumentChunk } from "./retrieval";
import { StylePreference } from "./learning";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

interface DB {
  documents: ProcessedDocument[];
  chunks: DocumentChunk[];
  preferences: StylePreference[];
  drafts: Array<{
    id: string;
    docId: string;
    originalContent: string;
    editedContent?: string;
    status: string;
    timestamp: string;
  }>;
}

async function ensureDB() {
  try {
    await fs.access(DB_PATH);
  } catch {
    const initialDB: DB = {
      documents: [],
      chunks: [],
      preferences: [],
      drafts: [],
    };
    await fs.writeFile(DB_PATH, JSON.stringify(initialDB, null, 2));
  }
}

export async function getDB(): Promise<DB> {
  await ensureDB();
  const data = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(data);
}

export async function saveDB(db: DB) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}
