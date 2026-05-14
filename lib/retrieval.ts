import { getEmbedding } from "./ai";

export interface DocumentChunk {
  id: string;
  docId: string;
  text: string;
  embedding: number[];
  metadata: Record<string, any>;
}

export async function chunkDocument(
  docId: string,
  text: string,
  metadata: Record<string, any>
): Promise<DocumentChunk[]> {
  // Simple paragraph-based chunking for this demo
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 50);
  
  const chunks: DocumentChunk[] = await Promise.all(
    paragraphs.map(async (p, i) => ({
      id: `${docId}-${i}`,
      docId,
      text: p.trim(),
      embedding: await getEmbedding(p.trim()),
      metadata,
    }))
  );

  return chunks;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function retrieveRelevantChunks(
  query: string,
  chunks: DocumentChunk[],
  topK: number = 3
): Promise<DocumentChunk[]> {
  const queryEmbedding = await getEmbedding(query);
  
  const scores = chunks.map(chunk => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.chunk);
}
