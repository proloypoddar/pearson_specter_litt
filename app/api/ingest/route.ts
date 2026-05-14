import { NextRequest, NextResponse } from "next/server";
import { processFile } from "@/lib/ingestion";
import { chunkDocument } from "@/lib/retrieval";
import { getDB, saveDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Step 1: Process and OCR
    const processedDoc = await processFile(buffer, file.name, file.type);

    // Step 2: Chunk for retrieval
    const chunks = await chunkDocument(processedDoc.id, processedDoc.cleanedText, processedDoc.metadata);

    // Step 3: Save to DB
    const db = await getDB();
    db.documents.push(processedDoc);
    db.chunks.push(...chunks);
    await saveDB(db);

    return NextResponse.json({ 
      success: true, 
      document: processedDoc,
      chunkCount: chunks.length 
    });
  } catch (error: any) {
    console.error("Ingestion error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
