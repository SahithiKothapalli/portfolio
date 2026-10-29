import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { retrieveRelevantContext } from "@/lib/vector";

export const runtime = "nodejs";

function generateFallbackRAGReply(userQuery: string, retrievedChunks: any[], reasonMessage?: string): string {
  const queryLower = (userQuery || "").toLowerCase();
  let reply = "";

  if (queryLower.includes("project") || queryLower.includes("built") || queryLower.includes("work")) {
    reply = `### 🚀 Featured Systems & Projects\n\nHere are the key production-grade systems engineered by **Sai Sahithi Kothapalli**:\n\n` +
      `1. **RAG-based Audit & Compliance Remediation Engine** *(Agentic AI Application)*\n` +
      `   - **Tech:** Python, FastAPI, Azure OpenAI, LangChain, LangGraph, FAISS, Groq, Docker\n` +
      `   - Built a stateful multi-step regulatory reasoning graph with conditional branching, cross-provider redundancy (99.5%+ uptime), and advanced hybrid chunking delivering a 30% retrieval boost.\n\n` +
      `2. **AI Observability & Guardrails Engine for RAG Systems** *(LLMOps & Evaluation)*\n` +
      `   - **Tech:** Python, FastAPI, LangChain, LangGraph, Azure OpenAI, Groq, FAISS, Redis\n` +
      `   - Reduced hallucinations by 25%+ using grounding checks, confidence scoring, and LLM-as-a-judge combined with rule-based guardrails.\n\n` +
      `3. **Ticket Resolution Automation System** *(Agentic AI Application)*\n` +
      `   - **Tech:** LangGraph, Groq, ServiceNow, n8n, Python\n` +
      `   - Automated incident triage and root-cause routing via Groq-powered LLMs, seamlessly bridging into ServiceNow via n8n.\n\n` +
      `4. **Agentic AI Firewall Audit System** *(Agentic AI Application)*\n` +
      `   - **Tech:** Model Context Protocol (MCP), LangGraph, Claude/OpenAI, FortiGate & Check Point APIs, Python\n` +
      `   - Standardized firewall inspection tools via MCP server architecture for automated compliance analysis across multi-vendor networks.`;
  } else if (queryLower.includes("experience") || queryLower.includes("career") || queryLower.includes("sify")) {
    reply = `### 💼 Professional Experience\n\n` +
      `**Software Engineer — AI/GenAI** · *Sify Technologies* (Jul 2024 – Present | Chennai, India)\n` +
      `- Worked on AI/GenAI projects for Bank of India (BOI Client), developing and deploying production-grade GenAI applications focused on agentic workflows, RAG pipelines, and LLM orchestration.\n` +
      `- Collaborated with cross-functional teams to integrate AI models into scalable enterprise-level solutions, improving operational efficiency and compliance automation.\n` +
      `- Conducted research and prototyping to integrate and scale AI solutions into enterprise infrastructure and standalone applications.\n\n` +
      `**GenAI Intern** · *Sify Technologies* (Feb 2024 – Jun 2024 | Chennai, India)\n` +
      `- Gained hands-on experience with Generative AI technologies, model inference, and deployment workflows.\n` +
      `- Cleared the AWS Certified Developer – Associate certification through applied cloud learning.`;
  } else if (queryLower.includes("skill") || queryLower.includes("tech") || queryLower.includes("stack") || queryLower.includes("language")) {
    reply = `### 🧠 Technical Capabilities & Stack\n\n` +
      `- **GenAI & Agentic Systems:** LangChain, LangGraph, RAG, Prompt Engineering, Tool Calling, Guardrails, Agent Workflows, Model Context Protocol (MCP)\n` +
      `- **LLMs & Orchestration:** Azure OpenAI, Groq, Claude, Multi-LLM Routing, Token Optimization\n` +
      `- **Languages & Backend:** Python, FastAPI, Async APIs, Pydantic, REST APIs\n` +
      `- **Retrieval & Databases:** FAISS, Vector Databases, Embeddings, Hybrid Search, Re-ranking, Chunking Strategies, Redis\n` +
      `- **ML & Frameworks:** PyTorch, TensorFlow, Hugging Face Transformers\n` +
      `- **Cloud & Systems:** AWS, Azure Cloud, Google Cloud Platform (GCP), Docker, CI/CD, Monitoring, Tracing`;
  } else if (queryLower.includes("certif") || queryLower.includes("credential")) {
    reply = `### 📜 Verified Credentials\n\n` +
      `1. **Google Cloud Certified:** Generative AI Leader\n` +
      `2. **Oracle Cloud Infrastructure:** Certified Data Science Professional\n` +
      `3. **Microsoft Certified:** Azure Data Fundamentals (DP-900)\n` +
      `4. **Amazon Web Services:** AWS Certified Developer – Associate`;
  } else if (queryLower.includes("education") || queryLower.includes("college") || queryLower.includes("degree")) {
    reply = `### 🎓 Education & Background\n\n` +
      `**Sagi Rama Krishnam Raju Engineering College (SRKR)** · *Bhimavaram, Andhra Pradesh*\n` +
      `- **Degree:** Bachelor of Technology in Computer Science Engineering (B.Tech CSE)\n` +
      `- **Duration:** June 2020 – April 2024\n` +
      `- **CGPA:** 8.75 / 10\n` +
      `- **Leadership:** Council Member of Association of Computer Science & Engineering, Host of Prajwalan national hackathon, completed Surge AI & Data Science Campus Program.`;
  } else if (retrievedChunks && retrievedChunks.length > 0) {
    reply = `### 📋 Information from Sahithi's Verified Portfolio\n\n`;
    retrievedChunks.forEach((c) => {
      reply += `#### ${c.title} (${c.documentType}):\n${c.content}\n\n`;
    });
  } else {
    reply = `Hello! I am Sahithi's AI Assistant. I can tell you all about her **projects** (RAG Audit Engine, Guardrails Engine, Ticket Automation, Firewall Audit), **work experience at Sify Technologies**, **technical skills**, **certifications** (Google Cloud, Oracle, Azure, AWS), or **education** at SRKR Engineering College. What would you like to know?`;
  }

  return reply;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1];
    const userQuery = latestMessage.content;

    // 1. Retrieve matching chunks from DB
    const retrievedChunks = await retrieveRelevantContext(userQuery, 4);

    // 2. Fetch active AI Settings
    const settings = await prisma.settings.findFirst();
    const apiKey = settings?.openaiApiKey || process.env.OPENAI_API_KEY;
    const model = settings?.model || "gpt-4o-mini";
    const temperature = settings?.temperature ?? 0.7;
    const maxTokens = settings?.maxTokens ?? 800;

    // 3. Format RAG context
    let contextText = "";
    if (retrievedChunks.length > 0) {
      contextText = retrievedChunks
        .map((chunk, index) => `[Source ${index + 1}: ${chunk.title} (${chunk.documentType})]\n${chunk.content}`)
        .join("\n\n");
    } else {
      contextText = "No direct facts retrieved. Respond based on general greetings or tell the recruiter you couldn't find specific details in Sahithi's portfolio.";
    }

    // 4. Construct System Prompt
    const systemPrompt = `
${settings?.systemPrompt || "You are Sahithi's AI Assistant."}
Active Personality: ${settings?.aiPersonality || "Helpful, professional AI Engineer."}

Available Context from Sahithi's actual Resume & CMS (use this as your exclusive source of truth):
---
${contextText}
---

Rules of engagement:
1. ONLY answer questions about Sahithi, her projects, skills, articles, and education.
2. Never claim skills or achievements not present in the context. Be truthful and professional.
3. If the user asks general questions unrelated to Sahithi (e.g. "What is the capital of France?"), respond: "I'm designed specifically to answer questions about Sahithi's portfolio, projects, and professional experience."
4. If a fact cannot be found in the context, politely respond: "I couldn't find that information in Sahithi's portfolio."
5. Use markdown formatting (bullet points, bold text, headings, code blocks) in your replies. Keep paragraphs short and highly readable.
`;

    // 5. Check if OpenAI API Key exists
    if (!apiKey || apiKey.trim() === "" || apiKey === "mock-key") {
      // Return beautiful mock-streamed response with retrieved details
      const encoder = new TextEncoder();
      
      let mockReply = ``;
      if (retrievedChunks.length > 0) {
        mockReply = `### Hello! I am in Preview Mode (OpenAI Key not set in Admin settings).\n\nHere is the raw data I retrieved from Sahithi's database for you:\n\n`;
        retrievedChunks.forEach((c) => {
          mockReply += `#### 💼 From ${c.title} (${c.documentType}):\n${c.content}\n\n`;
        });
        mockReply += `*Configure an OpenAI API Key in the [/admin/ai-settings](/admin/ai-settings) dashboard to enable full GPT conversational reasoning!*`;
      } else {
        mockReply = `### Hello! I am Sahithi's AI assistant (Preview Mode).\n\nI couldn't find any direct matches in the database for **"${userQuery}"**.\n\nTry asking about her **projects**, **skills**, or **experience**. You can also configure an OpenAI API Key in the [/admin/ai-settings](/admin/ai-settings) dashboard.`;
      }

      const stream = new ReadableStream({
        async start(controller) {
          // Stream word by word to simulate LLM speed
          const words = mockReply.split(" ");
          for (const word of words) {
            controller.enqueue(encoder.encode(word + " "));
            await new Promise((r) => setTimeout(r, 20)); // simulated latency
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // 6. Request streaming chat completion from OpenAI
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-8), // Keep last 8 messages for context memory
    ];

    let response: Response | null = null;
    let openAiErrorReason = "";

    try {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: apiMessages,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        console.warn("OpenAI API returned non-OK status:", response.status, errJson);
        if (response.status === 429) {
          openAiErrorReason = "OpenAI API quota exceeded for configured key (billing balance depleted)";
        } else if (response.status === 401) {
          openAiErrorReason = "OpenAI API key unauthorized";
        } else {
          openAiErrorReason = `OpenAI API returned status ${response.status}`;
        }
      }
    } catch (fetchErr: any) {
      console.warn("OpenAI API fetch failed:", fetchErr);
      openAiErrorReason = "OpenAI connection unavailable";
    }

    // If OpenAI failed or returned an error (e.g. 429 quota exhausted), gracefully fall back to local RAG
    if (!response || !response.ok) {
      const fallbackReply = generateFallbackRAGReply(userQuery, retrievedChunks, openAiErrorReason);
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const words = fallbackReply.split(" ");
          for (const word of words) {
            controller.enqueue(encoder.encode(word + " "));
            await new Promise((r) => setTimeout(r, 15));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // Pipe response stream to client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            
            // Save the last partial line back to the buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
              const cleanedLine = line.trim();
              if (cleanedLine === "") continue;
              if (cleanedLine === "data: [DONE]") continue;

              if (cleanedLine.startsWith("data: ")) {
                try {
                  const dataJson = JSON.parse(cleanedLine.substring(6));
                  const delta = dataJson.choices?.[0]?.delta?.content;
                  if (delta) {
                    controller.enqueue(encoder.encode(delta));
                  }
                } catch {
                  // Ignore parsing errors for partial lines
                }
              }
            }
          }
        } catch (err) {
          console.error("Error reading OpenAI response stream:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("API Chat route error:", error);
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
