import Tesseract from "tesseract.js";
import { PDFParse } from "pdf-parse";
import { openai } from "./ai";

export interface ProcessedDocument {
  id: string;
  rawText: string;
  cleanedText: string;
  structuredData: Record<string, any>;
  metadata: {
    fileName: string;
    fileType: string;
    timestamp: string;
  };
}

export async function processFile(
  buffer: Buffer,
  fileName: string,
  fileType: string
): Promise<ProcessedDocument> {
  let rawText = "";

  if (fileType === "application/pdf") {
    try {
      const parser = new PDFParse({ data: buffer });
      const data = await parser.getText();
      rawText = data.text;
      await parser.destroy();
    } catch (error) {
      console.error("PDF parsing failed, attempting OCR...", error);
      // Fallback to OCR if PDF is scanned
      rawText = await performOCR(buffer);
    }
  } else if (fileType.startsWith("image/")) {
    rawText = await performOCR(buffer);
  } else {
    rawText = buffer.toString("utf-8");
  }

  // Use LLM to clean noisy OCR text and extract structured fields
  const structuredData = await extractStructuredFields(rawText);

  return {
    id: crypto.randomUUID(),
    rawText,
    cleanedText: structuredData.cleanedContent || rawText,
    structuredData: structuredData.fields || {},
    metadata: {
      fileName,
      fileType,
      timestamp: new Date().toISOString(),
    },
  };
}

async function performOCR(imageBuffer: Buffer): Promise<string> {
  const { data: { text } } = await Tesseract.recognize(imageBuffer, "eng");
  return text;
}

async function extractStructuredFields(text: string) {
  const prompt = `
    The following is a messy OCR output from a legal document. 
    1. Clean up the text (fix spelling errors, formatting issues).
    2. Extract key structured fields like Client Name, Date, Case ID, Document Type, and any mentioned parties.
    3. Return the result as a JSON object with "cleanedContent" and "fields" keys.

    OCR Output:
    """
    ${text}
    """
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content || "{}");
}
