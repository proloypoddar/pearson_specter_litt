import { openai } from "./ai";

export interface StylePreference {
  id: string;
  pattern: string;
  rationale: string;
}

export async function learnFromEdits(
  originalDraft: string,
  editedVersion: string
): Promise<StylePreference[]> {
  const prompt = `
    Compare the following AI-generated draft with the version edited by a human operator.
    Identify recurring patterns, stylistic preferences, or structural changes the operator made.
    
    Original Draft:
    """
    ${originalDraft}
    """
    
    Edited Version:
    """
    ${editedVersion}
    """
    
    Extract 1-3 specific style preferences or rules that should be applied to future drafts.
    Return a JSON object with a "preferences" key, which is an array of { pattern: string, rationale: string }.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  const rawPreferences = result.preferences || [];
  
  return rawPreferences.map((p: any) => ({
    id: Math.random().toString(36).substring(7),
    ...p
  }));
}

export function compileSystemPrompt(preferences: StylePreference[]): string {
  const basePrompt = `
    You are an expert legal assistant for the firm Pearson Specter Litt.
    Your task is to generate grounded, professional, and accurate legal documents.
    Only use the provided context to support your claims.
  `;

  if (preferences.length === 0) return basePrompt;

  const styleGuidelines = preferences
    .map(p => `- ${p.pattern} (Rationale: ${p.rationale})`)
    .join("\n");

  return `
    ${basePrompt}
    
    Apply the following style guidelines derived from previous operator edits:
    ${styleGuidelines}
  `;
}
