import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/ai";
import { getDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const db = await getDB();

    // Use a small context from the DB for the chat if needed
    const docSummary = db.documents.map(d => d.metadata.fileName).join(", ");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are the Pearson Specter Litt Intelligence system. You assist Polok Poddar. Available documents: ${docSummary}. Be concise and professional.` 
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
