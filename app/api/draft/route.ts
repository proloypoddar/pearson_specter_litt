import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/ai";
import { retrieveRelevantChunks } from "@/lib/retrieval";
import { compileSystemPrompt } from "@/lib/learning";
import { getDB, saveDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { docId, taskType, query } = await req.json();

    const db = await getDB();
    const docChunks = db.chunks.filter(c => c.docId === docId);

    if (docChunks.length === 0) {
      return NextResponse.json({ error: "Document not found or not yet processed" }, { status: 404 });
    }

    // Step 1: Retrieve context
    const relevantChunks = await retrieveRelevantChunks(query || taskType, docChunks);
    const context = relevantChunks.map(c => `[ID: ${c.id}] ${c.text}`).join("\n\n");

    // Step 2: Compile prompt with learned preferences
    const systemPrompt = compileSystemPrompt(db.preferences);

    // Step 3: Generate Draft
    const prompt = `
      Task: Generate a ${taskType} based on the provided document context.
      
      Query/Focus: ${query || "Provide a comprehensive summary and analysis."}
      
      Document Context:
      """
      ${context}
      """
      
      Instructions:
      - Be precise and grounded.
      - Cite evidence using the ID in brackets (e.g., [ID: doc-123-0]).
      - If information is missing, do not hallucinate. State that it is not available in the source.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const draftContent = response.choices[0].message.content || "";

    // Step 4: Save draft
    const draft = {
      id: uuidv4(),
      docId,
      originalContent: draftContent,
      status: "Drafted",
      timestamp: new Date().toISOString(),
    };
    db.drafts.push(draft);
    await saveDB(db);

    return NextResponse.json({ 
      success: true, 
      draft,
      citations: relevantChunks.map(c => ({ id: c.id, text: c.text }))
    });
  } catch (error: any) {
    console.error("Drafting error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
