"use client";

import React, { useEffect, useRef, useState } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
  glowColor: string;
  size: number;
}

export default function NetworkViz() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resizeCanvas = () => {
      if (containerRef.current && canvas) {
        width = containerRef.current.clientWidth;
        height = containerRef.current.clientHeight || 450;
        canvas.width = width;
        canvas.height = height;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Node configuration representing Sahithi's skills
    const skillLabels = [
      "RAG Systems",
      "LangChain",
      "LangGraph",
      "n8n Automation",
      "Python",
      "FastAPI",
      "TypeScript",
      "Next.js",
      "pgvector",
      "Pinecone",
      "Docker",
      "Agentic AI",
      "LLM Architectures",
    ];

    const nodes: Node[] = skillLabels.map((label, i) => {
      const isCore = i < 4; // First few are core nodes (larger, glowing)
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: isCore ? 6 : 4,
        label,
        glowColor: isCore ? "rgba(168, 85, 247, 0.4)" : "rgba(109, 40, 217, 0.2)",
        size: isCore ? 14 : 10,
      };
    });

    let mouse = { x: -1000, y: -1000, radius: 120 };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Check hover
      let currentHover: string | null = null;

      // Draw Connections (lines)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update and Draw Nodes
      nodes.forEach((node) => {
        // Drifting movement
        node.x += node.vx;
        node.y += node.vy;

        // Wall collisions
        if (node.x < 10 || node.x > width - 10) node.vx *= -1;
        if (node.y < 10 || node.y > height - 10) node.vy *= -1;

        // Mouse attraction
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          node.x -= (dx / dist) * force * 1.5;
          node.y -= (dy / dist) * force * 1.5;

          // Detect node label hover
          if (dist < 30) {
            currentHover = node.label;
          }
        }

        // Draw Ambient Glow for core nodes
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = node.glowColor;
        ctx.fill();

        // Draw Core Node Dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#A855F7";
        ctx.fill();

        // Draw text label
        ctx.fillStyle = "rgba(161, 161, 170, 0.85)";
        ctx.font = `500 ${node.size}px var(--font-sans), sans-serif`;
        ctx.fillText(node.label, node.x + 10, node.y + 4);
      });

      setHoveredNode(currentHover);
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[450px] overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      {hoveredNode && (
        <div className="absolute bottom-4 right-4 bg-black/40 dark:bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-accent-mauve tracking-wide shadow-luxury-dark animate-pulse">
          Active Cluster: {hoveredNode}
        </div>
      )}
    </div>
  );
}
