import { NextRequest, NextResponse } from "next/server";
import { learnFromEdits } from "@/lib/learning";
import { getDB, saveDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { draftId, editedContent } = await req.json();

    const db = await getDB();
    const draftIndex = db.drafts.findIndex(d => d.id === draftId);

    if (draftIndex === -1) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }

    const draft = db.drafts[draftIndex];
    const originalContent = draft.originalContent;

    // Step 1: Learn from edits
    const newPreferences = await learnFromEdits(originalContent, editedContent);

    // Step 2: Update draft status and content
    db.drafts[draftIndex] = {
      ...draft,
      editedContent,
      status: "Finalized",
    };

    // Step 3: Add unique new preferences to DB
    newPreferences.forEach(pref => {
      const exists = db.preferences.some(p => p.pattern === pref.pattern);
      if (!exists) {
        db.preferences.push(pref);
      }
    });

    await saveDB(db);

    return NextResponse.json({ 
      success: true, 
      newPatternsCount: newPreferences.length 
    });
  } catch (error: any) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
