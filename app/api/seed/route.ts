import { NextResponse } from "next/server";
import { getDB, saveDB } from "@/lib/db";
import { getEmbedding } from "@/lib/ai";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
  try {
    const db = await getDB();
    
    const sampleDoc = {
      id: uuidv4(),
      rawText: "Sample Legal Notice: Case #882-X. Land dispute at 123 Law Lane. Evidence includes a contract dated 2022-05-15 and a handwritten note signed by J. Harvey.",
      cleanedText: "Sample Legal Notice: Case #882-X. Land dispute at 123 Law Lane. Evidence includes a contract dated May 15, 2022 and a handwritten note signed by J. Harvey.",
      structuredData: {
        caseId: "#882-X",
        property: "123 Law Lane",
        evidence: ["Contract 2022-05-15", "Handwritten note"]
      },
      metadata: {
        fileName: "Sample_Notice.pdf",
        fileType: "application/pdf",
        timestamp: new Date().toISOString(),
      }
    };

    const embedding = await getEmbedding(sampleDoc.cleanedText);
    const chunk = {
      id: `${sampleDoc.id}-0`,
      docId: sampleDoc.id,
      text: sampleDoc.cleanedText,
      embedding,
      metadata: sampleDoc.metadata
    };

    db.documents.push(sampleDoc);
    db.chunks.push(chunk);
    await saveDB(db);

    return NextResponse.json({ success: true, document: sampleDoc });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
