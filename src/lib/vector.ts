import { prisma } from "./db";

// Calculate Cosine Similarity between two numeric vectors
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function generateEmbedding(text: string, apiKey: string): Promise<number[] | null> {
  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: text.replace(/\n/g, " "),
        model: "text-embedding-3-large",
      }),
    });

    if (!response.ok) {
      return null;
    }

    const resData = await response.json().catch(() => null);
    if (resData?.data?.[0]?.embedding) {
      return resData.data[0].embedding;
    }
    return null;
  } catch {
    return null;
  }
}

// Intelligent Text Splitter (Sliding Window Chunking)
export function chunkText(text: string, chunkSize: number = 600, overlap: number = 100): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  if (words.length <= chunkSize) {
    return [text];
  }

  let i = 0;
  while (i < words.length) {
    const chunkWords = words.slice(i, i + chunkSize);
    chunks.push(chunkWords.join(" "));
    i += chunkSize - overlap;
  }

  return chunks;
}

// Keyword-based search fallback when OpenAI keys are not configured
function keywordSearchScore(text: string, query: string): number {
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (queryWords.length === 0) return 0;
  
  let matches = 0;
  const lowerText = text.toLowerCase();
  
  queryWords.forEach(word => {
    if (lowerText.includes(word)) {
      matches += 1;
    }
  });

  return matches / queryWords.length;
}

interface RetrieveResult {
  content: string;
  title: string;
  documentType: string;
  documentId: string;
  score: number;
}

// Main Retrieval Interface
export async function retrieveRelevantContext(
  query: string,
  limit: number = 4
): Promise<RetrieveResult[]> {
  try {
    // 1. Get OpenAI Settings
    const settings = await prisma.settings.findFirst();
    const apiKey = settings?.openaiApiKey || process.env.OPENAI_API_KEY;

    // 2. Fetch all stored chunks from db
    const chunks = await prisma.knowledgeChunk.findMany();
    if (chunks.length === 0) return [];

    // 3. Check if OpenAI Embeddings are available
    if (apiKey) {
      try {
        const queryVector = await generateEmbedding(query, apiKey);
        if (queryVector && queryVector.length > 0) {
          // Calculate similarity for all chunks
          const scoredChunks = chunks.map((chunk) => {
            try {
              const chunkVector = JSON.parse(chunk.embedding) as number[];
              const score = cosineSimilarity(queryVector, chunkVector);
              return {
                content: chunk.content,
                title: chunk.title,
                documentType: chunk.documentType,
                documentId: chunk.documentId,
                score,
              };
            } catch {
              return {
                content: chunk.content,
                title: chunk.title,
                documentType: chunk.documentType,
                documentId: chunk.documentId,
                score: 0,
              };
            }
          });

          const filtered = scoredChunks
            .filter((c) => c.score > 0.2)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

          if (filtered.length > 0) {
            return filtered;
          }
        }
      } catch {
        // gracefully fall through to keyword search
      }
    }

    // 4. Fallback Keyword Search Ranking
    const scoredChunks = chunks.map((chunk) => {
      const score = keywordSearchScore(chunk.content, query);
      return {
        content: chunk.content,
        title: chunk.title,
        documentType: chunk.documentType,
        documentId: chunk.documentId,
        score,
      };
    });

    return scoredChunks
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error("Retrieval error:", error);
    return [];
  }
}

// Auto-indexing helpers to update single document chunks
export async function indexDocument(
  documentType: string,
  documentId: string,
  title: string,
  content: string
) {
  try {
    const settings = await prisma.settings.findFirst();
    const apiKey = settings?.openaiApiKey || process.env.OPENAI_API_KEY;

    // Delete existing chunks for this specific document
    await prisma.knowledgeChunk.deleteMany({
      where: {
        documentType,
        documentId,
      },
    });

    // Split content into chunks
    const textChunks = chunkText(content, 400, 75);

    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      let embeddingStr = "[]";

      if (apiKey) {
        try {
          const vector = await generateEmbedding(chunk, apiKey);
          embeddingStr = JSON.stringify(vector);
        } catch (err) {
          console.warn(`Failed to embed chunk ${i} for ${title}:`, err);
        }
      }

      await prisma.knowledgeChunk.create({
        data: {
          documentType,
          documentId,
          title: `${title} (Part ${i + 1})`,
          content: chunk,
          embedding: embeddingStr,
        },
      });
    }

    // Log the re-indexing action
    await prisma.activityLog.create({
      data: {
        action: "Re-index Knowledge",
        details: `Re-indexed ${documentType} "${title}" into ${textChunks.length} chunks.`,
      },
    });
  } catch (error) {
    console.error(`Failed to index ${documentType} (${documentId}):`, error);
  }
}
