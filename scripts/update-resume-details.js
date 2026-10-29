const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function updateDetails() {
  console.log('--- Updating Portfolio Database with Real Resume Details ---');

  // 1. Profile
  const existingProfile = await prisma.profile.findFirst();
  const profileData = {
    name: 'Sai Sahithi Kothapalli',
    title: 'AI Engineer',
    subtitle: 'Building Enterprise AI Applications with RAG, Agentic AI & LLM Orchestration',
    bio: 'Results-driven AI Engineer with 2+ years of experience building enterprise AI applications using RAG, agentic AI, and LLM orchestration. Experienced in developing AI-driven workflow automation, intelligent assistants, and production-ready AI systems that streamline enterprise operations and reduce manual effort. Proficient in Python, LangChain, LangGraph, FastAPI, and modern LLM frameworks.',
    email: 'saisahithikothapalli@gmail.com',
    phone: '+91 9502532686',
    location: 'Chennai, India',
    githubUrl: 'https://github.com/sahithiai',
    linkedinUrl: 'https://linkedin.com/in/saisahithikothapalli',
    twitterUrl: '',
    mediumUrl: '',
    resumeUrl: '/resume.pdf',
    avatarUrl: existingProfile?.avatarUrl || '/portrait.jpg',
  };

  if (existingProfile) {
    await prisma.profile.update({
      where: { id: existingProfile.id },
      data: profileData,
    });
    console.log('✓ Profile updated');
  } else {
    await prisma.profile.create({ data: profileData });
    console.log('✓ Profile created');
  }

  // 2. ID Card JSON
  const idCardPath = path.join(__dirname, '..', 'prisma', 'idcard.json');
  const idCardData = {
    cardName: 'Sai Sahithi Kothapalli',
    cardRole: 'AI Engineer',
    cardPhotoUrl: '/portrait.jpg',
    cardBackHeadline: 'WHO I AM',
    cardFact1: '🧠 Building agentic AI systems & autonomous loops',
    cardFact2: '⚡ Production RAG architect & vector pipelines',
    cardFact3: '🔁 Multi-agent workflow designer (LangGraph & n8n)',
    cardFact4: '🌐 Enterprise GenAI applications @ Sify Technologies',
  };
  fs.writeFileSync(idCardPath, JSON.stringify(idCardData, null, 2), 'utf-8');
  console.log('✓ ID Card JSON updated');

  // 3. Work Experience (Sify Technologies Jul 2024 - Present, and GenAI Intern Feb 2024 - Jun 2024)
  await prisma.experience.deleteMany({});
  const experiences = [
    {
      company: 'Sify Technologies',
      role: 'Software Engineer — AI/GenAI',
      duration: 'Jul 2024 – Present',
      achievements: JSON.stringify([
        'Worked on AI/GenAI projects for Bank of India (BOI Client), developing and deploying production-grade GenAI applications focused on agentic workflows, RAG pipelines, and LLM orchestration.',
        'Collaborated with cross-functional teams to integrate AI models into scalable enterprise-level solutions, improving operational efficiency and compliance automation.',
        'Conducted research and prototyping to integrate and scale AI solutions into enterprise infrastructure and standalone applications.',
      ]),
      technologies: JSON.stringify([
        'Python',
        'FastAPI',
        'LangChain',
        'LangGraph',
        'RAG',
        'LLM Orchestration',
        'Agentic Workflows',
        'Azure OpenAI',
        'Docker',
      ]),
      order: 1,
    },
    {
      company: 'Sify Technologies',
      role: 'GenAI Intern',
      duration: 'Feb 2024 – Jun 2024',
      achievements: JSON.stringify([
        'Gained hands-on experience with Generative AI technologies, tools, and frameworks, including model inference and deployment workflows.',
        'Developed practical proficiency with AWS cloud services and subsequently cleared the AWS Certified Developer – Associate certification through applied learning.',
      ]),
      technologies: JSON.stringify([
        'Generative AI',
        'Python',
        'AWS',
        'Model Inference',
        'Deployment Workflows',
        'Prompt Engineering',
      ]),
      order: 2,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log('✓ Work Experiences updated (2 roles at Sify Technologies)');

  // 4. Projects (4 Projects from Resume)
  await prisma.project.deleteMany({});
  const projects = [
    {
      title: 'RAG-based Audit & Compliance Remediation Engine',
      summary: 'Stateful agentic GenAI system for regulatory reasoning using RAG and multi-step workflows with graph-based orchestration.',
      description: 'Built a stateful agentic GenAI system for regulatory reasoning using RAG and multi-step workflows; implemented graph-based orchestration with conditional execution, retries, and tool calling. Developed high-throughput document processing workflows to synthesize disparate regulatory sources into optimized vector stores and structured knowledge repositories. Designed a cross-provider LLM orchestration framework to mitigate API rate limits and provider outages, achieving 99.5%+ service availability through strategic redundancy. Enhanced retrieval quality by implementing advanced chunking and hybrid search strategies, delivering a 30% improvement in system performance. Engineered an enterprise-grade evaluation and validation layer using confidence thresholds and system-prompt optimization to minimize hallucination risks.',
      problem: 'Regulatory compliance audits require reasoning over disparate unstructured documents while mitigating API outages, rate limits, and hallucination risks.',
      solution: 'Stateful graph orchestration with LangGraph, cross-provider LLM redundancy (99.5%+ uptime), advanced hybrid search chunking (30% boost), and validation layers.',
      architecture: 'Python · FastAPI · Azure OpenAI · LangChain · LangGraph · FAISS · Groq · Docker',
      techStack: 'Python, FastAPI, Azure OpenAI, LangChain, LangGraph, FAISS, Groq, Docker',
      challenges: 'Cross-provider rate limits and provider outages during high-volume document ingestion.',
      lessonsLearned: 'Engineered an adaptive fallback loop across Azure OpenAI and Groq with automatic retry backoff, maintaining 99.5%+ system availability.',
      futureImprovements: 'Integrate real-time compliance diff monitors with continuous vector re-indexing.',
      demoUrl: '',
      githubUrl: 'https://github.com/sahithiai',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      order: 1,
    },
    {
      title: 'AI Observability & Guardrails Engine for RAG Systems',
      summary: 'Observability and evaluation engine for production RAG systems with grounding checks, LLM-as-a-judge, and real-time tracing.',
      description: 'Built an observability and evaluation engine for RAG systems, monitoring LLM responses, retrieval quality, and overall system performance in real time. Reduced hallucinations by 25%+ using grounding checks, confidence scoring, and LLM-based evaluation (LLM-as-a-judge). Implemented guardrails combining LLM-as-a-judge with rule-based validation, lowering invalid responses by 30%. Enabled end-to-end pipeline tracing, improving debugging time by 40%, and monitored multi-LLM usage across Azure OpenAI and Groq to optimize latency, reliability, and cost.',
      problem: 'Production RAG pipelines suffer from silent retrieval failures, latency bottlenecks, and hallucinations without comprehensive real-time observability.',
      solution: 'Deployed end-to-end tracing (40% faster debugging), dual guardrails combining LLM-as-a-judge with deterministic rules (30% fewer invalid responses), and multi-LLM cost/latency monitoring.',
      architecture: 'Python · FastAPI · LangChain · LangGraph · Azure OpenAI · Groq · FAISS · Redis',
      techStack: 'Python, FastAPI, LangChain, LangGraph, Azure OpenAI, Groq, FAISS, Redis',
      challenges: 'Balancing evaluation overhead with real-time response latency requirements.',
      lessonsLearned: 'Asynchronous evaluation queues and Redis caching minimized latency overhead to under 15ms while retaining rigorous grounding checks.',
      futureImprovements: 'Automated synthetic dataset generation for fine-tuning guardrail models.',
      demoUrl: '',
      githubUrl: 'https://github.com/sahithiai',
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
      order: 2,
    },
    {
      title: 'Ticket Resolution Automation System',
      summary: 'Autonomous agentic IT ticket resolution pipeline with automated triage, root-cause analysis, and ServiceNow workflow integration.',
      description: 'Architected an agentic AI workflow using LangGraph (Python) to automate ticket resolution within Sify’s IT management ecosystem, introducing intelligent state-based decision-making. Orchestrated automated triage, root-cause analysis, and resolution routing using Groq-powered LLMs, significantly reducing mean time to resolution (MTTR) for recurring incidents. Built n8n automation pipelines to bridge the agentic AI layer with enterprise ServiceNow workflows, enabling seamless handoff between AI-driven decisions and human escalation paths. Implemented stateful conversation graphs with LangGraph to handle multi-turn diagnostic reasoning and conditional escalation logic across complex incident types.',
      problem: 'High IT ticket volumes create long resolution delays, manual triage bottlenecks, and fragmented handoffs between automated scripts and human operators.',
      solution: 'Stateful LangGraph conversation graphs for multi-turn diagnostic reasoning, Groq-powered triage for rapid MTTR reduction, and n8n pipelines bridging ServiceNow with human escalation.',
      architecture: 'LangGraph · Groq · ServiceNow · n8n · Python',
      techStack: 'LangGraph, Groq, ServiceNow, n8n, Python',
      challenges: 'Handling non-standard ticket formats and complex multi-issue incident reports.',
      lessonsLearned: 'Structured Pydantic intent classification before entering the multi-turn diagnosis graph drastically reduced misrouting.',
      futureImprovements: 'Self-updating knowledge base generated from resolved incident resolutions.',
      demoUrl: '',
      githubUrl: 'https://github.com/sahithiai',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      order: 3,
    },
    {
      title: 'Agentic AI Firewall Audit System',
      summary: 'AI-driven security policy analysis across FortiGate and Check Point firewalls using Model Context Protocol (MCP) and dynamic tool calling.',
      description: 'Built a fully agentic firewall audit application using Model Context Protocol (MCP) and LangGraph, enabling AI-driven security policy analysis across FortiGate and Check Point firewalls. Implemented tool calling to dynamically invoke FortiGate REST API and Check Point Management API endpoints, extracting firewall rules, policy configurations, and compliance posture in real time. Designed stateful audit workflows using LangGraph graphs with conditional branching, enabling the agent to reason across multi-vendor environments and generate consolidated compliance reports. Leveraged MCP server architecture to expose firewall audit tools as structured, reusable AI-callable functions, improving modularity and enabling seamless LLM-driven orchestration.',
      problem: 'Auditing complex multi-vendor firewall policies (FortiGate & Check Point) manually is labor-intensive, error-prone, and slow to produce compliance reports.',
      solution: 'Standardized firewall inspection tools via Model Context Protocol (MCP), dynamic API tool calling, and stateful LangGraph workflows to generate consolidated compliance reports.',
      architecture: 'MCP · LangGraph · Claude/OpenAI · FortiGate REST API · Check Point API · Tool Calling · Python',
      techStack: 'MCP, LangGraph, Python, Claude, OpenAI, REST API, Tool Calling',
      challenges: 'Reconciling divergent policy schemas between FortiGate and Check Point API responses.',
      lessonsLearned: 'Standardized tool definitions via MCP schemas with strict JSON validation allowed the reasoning LLM to operate vendor-agnostic.',
      futureImprovements: 'Automated remediation script generation with human-in-the-loop approval gates.',
      demoUrl: '',
      githubUrl: 'https://github.com/sahithiai',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      order: 4,
    },
  ];

  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }
  console.log('✓ Projects updated (4 projects from resume)');

  // 5. Certifications (4 Certifications from Resume)
  await prisma.certificate.deleteMany({});
  const certificates = [
    {
      name: 'Google Cloud Certified: Generative AI Leader',
      issuer: 'Google Cloud',
      date: '2024',
      credentialUrl: 'https://cloud.google.com/certification',
      order: 1,
    },
    {
      name: 'Oracle Cloud Infrastructure Certified Data Science Professional',
      issuer: 'Oracle',
      date: '2024',
      credentialUrl: 'https://www.oracle.com/cloud/certification',
      order: 2,
    },
    {
      name: 'Microsoft Certified: Azure Data Fundamentals (DP-900)',
      issuer: 'Microsoft',
      date: '2024',
      credentialUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-data-fundamentals',
      order: 3,
    },
    {
      name: 'AWS Certified Developer – Associate',
      issuer: 'Amazon Web Services (AWS)',
      date: '2024',
      credentialUrl: 'https://aws.amazon.com/certification/certified-developer-associate',
      order: 4,
    },
  ];

  for (const cert of certificates) {
    await prisma.certificate.create({ data: cert });
  }
  console.log('✓ Certifications updated (4 certifications from resume)');

  // 6. Skills (Complete representation matching resume categories)
  await prisma.skill.deleteMany({});
  const skillsList = [
    // GenAI & Agentic Systems
    { name: 'LangGraph', category: 'AI', description: 'Stateful multi-agent workflows, cyclic graphs, conditional branching, human-in-the-loop escalation.', yearsOfExperience: 2.5, order: 1 },
    { name: 'LangChain', category: 'AI', description: 'Agent orchestration, LCEL primitives, memory management, and tool integration.', yearsOfExperience: 2.5, order: 2 },
    { name: 'RAG Systems', category: 'AI', description: 'Hybrid search, re-ranking, chunking strategies, and embedding retrieval pipelines.', yearsOfExperience: 2.5, order: 3 },
    { name: 'Model Context Protocol (MCP)', category: 'AI', description: 'Standardized tool servers, local execution gateways, and policy guardrails.', yearsOfExperience: 2.0, order: 4 },
    { name: 'Agent Workflows & Tool Calling', category: 'AI', description: 'Autonomous tool invocation, dynamic API routing, and stateful decision loops.', yearsOfExperience: 2.5, order: 5 },
    { name: 'Guardrails & LLMOps', category: 'AI', description: 'LLM-as-a-judge evaluation, hallucination suppression, and end-to-end tracing.', yearsOfExperience: 2.0, order: 6 },
    { name: 'Prompt Engineering', category: 'AI', description: 'System prompt optimization, few-shot reasoning, structured outputs, prompt versioning.', yearsOfExperience: 2.5, order: 7 },
    { name: 'n8n Automation', category: 'AI', description: 'Visual automation pipelines connecting agent graphs with ServiceNow and enterprise APIs.', yearsOfExperience: 2.0, order: 8 },

    // Languages & Backend
    { name: 'Python', category: 'Languages', description: 'Primary backend and AI language: asynchronous programming, Pydantic data schemas, typing.', yearsOfExperience: 3.5, order: 9 },
    { name: 'FastAPI', category: 'Backend', description: 'High-throughput asynchronous Python microservices with OpenAPI documentation.', yearsOfExperience: 2.5, order: 10 },
    { name: 'REST APIs & Async APIs', category: 'Backend', description: 'Enterprise REST integrations, rate-limit mitigations, webhook handlers, Pydantic schemas.', yearsOfExperience: 3.0, order: 11 },

    // LLMs & Orchestration
    { name: 'Azure OpenAI', category: 'AI', description: 'Enterprise OpenAI model deployments, cognitive services, and token optimization.', yearsOfExperience: 2.0, order: 12 },
    { name: 'Groq', category: 'AI', description: 'Ultra-low latency LPU model inference for real-time ticket triage and agent routing.', yearsOfExperience: 2.0, order: 13 },
    { name: 'Claude / Anthropic', category: 'AI', description: 'Extended reasoning, MCP tool calling, and long-context compliance audits.', yearsOfExperience: 2.0, order: 14 },

    // Retrieval & Data
    { name: 'FAISS', category: 'Databases', description: 'High-performance vector similarity search and dense vector indexing.', yearsOfExperience: 2.5, order: 15 },
    { name: 'Vector Databases', category: 'Databases', description: 'Dense and sparse vector stores, hybrid indexing, cosine similarity, embeddings.', yearsOfExperience: 2.5, order: 16 },
    { name: 'Redis', category: 'Databases', description: 'In-memory caching, pipeline state persistence, and pub/sub message queuing.', yearsOfExperience: 2.0, order: 17 },

    // ML & Frameworks
    { name: 'PyTorch', category: 'AI', description: 'Deep learning workflows, tensor calculations, and fine-tuning embeddings.', yearsOfExperience: 2.0, order: 18 },
    { name: 'TensorFlow', category: 'AI', description: 'Machine learning fundamentals, model training, and inference pipelines.', yearsOfExperience: 2.0, order: 19 },
    { name: 'Hugging Face Transformers', category: 'AI', description: 'Pre-trained transformer models, tokenizer pipelines, and embeddings.', yearsOfExperience: 2.0, order: 20 },

    // Cloud & Systems
    { name: 'AWS', category: 'DevOps', description: 'AWS Certified Developer – Associate: S3, Lambda, EC2, IAM, and cloud deployment.', yearsOfExperience: 2.0, order: 21 },
    { name: 'Azure Cloud', category: 'DevOps', description: 'Azure AI Search, Blob Storage, Cognitive Services, Azure Machine Learning (DP-900 Certified).', yearsOfExperience: 2.0, order: 22 },
    { name: 'Google Cloud Platform (GCP)', category: 'DevOps', description: 'Google Cloud Certified Generative AI Leader: cloud infrastructure and AI solutions.', yearsOfExperience: 2.0, order: 23 },
    { name: 'Docker', category: 'DevOps', description: 'Containerized deployment pipelines, multi-stage builds, and isolated agent runtimes.', yearsOfExperience: 2.5, order: 24 },
    { name: 'CI/CD & Monitoring', category: 'DevOps', description: 'Automated test workflows, pipeline tracing, health monitoring, and logging.', yearsOfExperience: 2.5, order: 25 },
  ];

  for (const sk of skillsList) {
    await prisma.skill.create({ data: sk });
  }
  console.log(`✓ Skills updated (${skillsList.length} skills categorized matching resume)`);

  // 7. Knowledge Chunks for Chatbot & RAG Assistant
  await prisma.knowledgeChunk.deleteMany({});
  const knowledge = [
    {
      documentType: 'Profile',
      documentId: 'profile-summary',
      title: 'Sai Sahithi Kothapalli - Professional Summary',
      content: 'Sai Sahithi Kothapalli is an AI Engineer with 2+ years of experience building enterprise AI applications using RAG, agentic AI, and LLM orchestration. Experienced in developing AI-driven workflow automation, intelligent assistants, and production-ready AI systems that streamline enterprise operations and reduce manual effort. Proficient in Python, LangChain, LangGraph, FastAPI, and modern LLM frameworks. Email: saisahithikothapalli@gmail.com, Phone: +91 9502532686, Location: Chennai, India, LinkedIn: https://linkedin.com/in/saisahithikothapalli.',
      embedding: '[]',
    },
    {
      documentType: 'Experience',
      documentId: 'exp-sify-fulltime',
      title: 'Work Experience - Sify Technologies (Software Engineer AI/GenAI)',
      content: 'Role: Software Engineer — AI/GenAI at Sify Technologies, Chennai, India (Jul 2024 – Present). Worked on AI/GenAI projects for Bank of India (BOI Client), developing and deploying production-grade GenAI applications focused on agentic workflows, RAG pipelines, and LLM orchestration. Collaborated with cross-functional teams to integrate AI models into scalable enterprise-level solutions, improving operational efficiency and compliance automation. Conducted research and prototyping to integrate and scale AI solutions into enterprise infrastructure and standalone applications.',
      embedding: '[]',
    },
    {
      documentType: 'Experience',
      documentId: 'exp-sify-intern',
      title: 'Work Experience - Sify Technologies (GenAI Intern)',
      content: 'Role: GenAI Intern at Sify Technologies, Chennai, India (Feb 2024 – Jun 2024). Gained hands-on experience with Generative AI technologies, tools, and frameworks, including model inference and deployment workflows. Developed practical proficiency with AWS cloud services and subsequently cleared the AWS Certified Developer – Associate certification through applied learning.',
      embedding: '[]',
    },
    {
      documentType: 'Project',
      documentId: 'proj-audit-remediation',
      title: 'Project - RAG-based Audit & Compliance Remediation Engine',
      content: 'RAG-based Audit & Compliance Remediation Engine (Agentic AI Application). Technologies: Python, FastAPI, Azure OpenAI, LangChain, LangGraph, FAISS, Groq, Docker. Built a stateful agentic GenAI system for regulatory reasoning using RAG and multi-step workflows; implemented graph-based orchestration with conditional execution, retries, and tool calling. Developed high-throughput document processing workflows to synthesize disparate regulatory sources into optimized vector stores and structured knowledge repositories. Designed a cross-provider LLM orchestration framework to mitigate API rate limits and provider outages, achieving 99.5%+ service availability through strategic redundancy. Enhanced retrieval quality by implementing advanced chunking and hybrid search strategies, delivering a 30% improvement in system performance. Engineered an enterprise-grade evaluation and validation layer using confidence thresholds and system-prompt optimization to minimize hallucination risks.',
      embedding: '[]',
    },
    {
      documentType: 'Project',
      documentId: 'proj-observability-guardrails',
      title: 'Project - AI Observability & Guardrails Engine for RAG Systems',
      content: 'AI Observability & Guardrails Engine for RAG Systems (LLMOps & Evaluation). Technologies: Python, FastAPI, LangChain, LangGraph, Azure OpenAI, Groq, FAISS, Redis. Built an observability and evaluation engine for RAG systems, monitoring LLM responses, retrieval quality, and overall system performance in real time. Reduced hallucinations by 25%+ using grounding checks, confidence scoring, and LLM-based evaluation (LLM-as-a-judge). Implemented guardrails combining LLM-as-a-judge with rule-based validation, lowering invalid responses by 30%. Enabled end-to-end pipeline tracing, improving debugging time by 40%, and monitored multi-LLM usage across Azure OpenAI and Groq to optimize latency, reliability, and cost.',
      embedding: '[]',
    },
    {
      documentType: 'Project',
      documentId: 'proj-ticket-automation',
      title: 'Project - Ticket Resolution Automation System',
      content: 'Ticket Resolution Automation System (Agentic AI Application). Technologies: LangGraph, Groq, ServiceNow, n8n, Python. Architected an agentic AI workflow using LangGraph (Python) to automate ticket resolution within Sify’s IT management ecosystem, introducing intelligent state-based decision-making. Orchestrated automated triage, root-cause analysis, and resolution routing using Groq-powered LLMs, significantly reducing mean time to resolution (MTTR) for recurring incidents. Built n8n automation pipelines to bridge the agentic AI layer with enterprise ServiceNow workflows, enabling seamless handoff between AI-driven decisions and human escalation paths. Implemented stateful conversation graphs with LangGraph to handle multi-turn diagnostic reasoning and conditional escalation logic across complex incident types.',
      embedding: '[]',
    },
    {
      documentType: 'Project',
      documentId: 'proj-firewall-audit',
      title: 'Project - Agentic AI Firewall Audit System',
      content: 'Agentic AI Firewall Audit System (Agentic AI Application). Technologies: MCP, LangGraph, Claude/OpenAI, FortiGate REST API, Check Point API, Tool Calling, Python. Built a fully agentic firewall audit application using Model Context Protocol (MCP) and LangGraph, enabling AI-driven security policy analysis across FortiGate and Check Point firewalls. Implemented tool calling to dynamically invoke FortiGate REST API and Check Point Management API endpoints, extracting firewall rules, policy configurations, and compliance posture in real time. Designed stateful audit workflows using LangGraph graphs with conditional branching, enabling the agent to reason across multi-vendor environments and generate consolidated compliance reports. Leveraged MCP server architecture to expose firewall audit tools as structured, reusable AI-callable functions, improving modularity and enabling seamless LLM-driven orchestration.',
      embedding: '[]',
    },
    {
      documentType: 'Education',
      documentId: 'edu-srkr',
      title: 'Education - Sagi Rama Krishnam Raju Engineering College',
      content: 'Institution: Sagi Rama Krishnam Raju Engineering College, Bhimavaram, Andhra Pradesh. Degree: Bachelor of Technology in Computer Science Engineering (B.Tech CSE). Duration: June 2020 – April 2024. CGPA: 8.75/10. Elected Council Member of Association of Computer Science & Engineering. Hosted Prajwalan, national-level hackathon. Completed Surge AI & Data Science Campus Program.',
      embedding: '[]',
    },
    {
      documentType: 'Certifications',
      documentId: 'cert-all',
      title: 'Certifications - Industry Credentials',
      content: '1. Google Cloud Certified: Generative AI Leader (Google Cloud, 2024). 2. Oracle Cloud Infrastructure Certified Data Science Professional (Oracle, 2024). 3. Microsoft Certified: Azure Data Fundamentals DP-900 (Microsoft, 2024). 4. AWS Certified Developer – Associate (Amazon Web Services, 2024).',
      embedding: '[]',
    },
  ];

  for (const chunk of knowledge) {
    await prisma.knowledgeChunk.create({ data: chunk });
  }
  console.log(`✓ Knowledge Chunks updated (${knowledge.length} chunks for AI chat)`);

  // 8. Log activity
  await prisma.activityLog.create({
    data: {
      action: 'Backend Update',
      details: 'Updated profile, Sify Technologies experience, 4 production projects, 4 cloud certifications, and technical skills from resume.',
    },
  });

  console.log('\nAll details successfully filled into backend admin console and database!');
}

updateDetails()
  .catch((e) => {
    console.error('Error updating details:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
