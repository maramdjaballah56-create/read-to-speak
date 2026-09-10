// app/api/ai/chat/route.ts
//
// Real endpoint for the AI Study Partner. Requires ANTHROPIC_API_KEY
// in your environment (see .env.example).

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface ChatRequestBody {
  unitId: string;
  level: string;
  vocab: string[];
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatRequestBody;
  const { level, vocab, message, history } = body;

  const systemPrompt = `You are a strict but encouraging English speaking coach for a ${level}-level learner.
Target vocabulary for this unit: ${vocab.join(", ")}.
Rules:
- Reply in simple, level-appropriate English.
- After your reply, add a JSON block on its own line starting with "###DATA###" containing:
  {"corrections":[{"type":"grammar|spelling|pronunciation|conjugation","original":"","fix":"","explanation":""}],"vocabHits":["word1"]}
- Only include real mistakes in "corrections" — never invent them.
- Only include words from the target vocabulary list that the learner actually used in "vocabHits".`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    system: systemPrompt,
    messages: [...history, { role: "user", content: message }],
  });

  const raw = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n");

  const [replyText, dataBlock] = raw.split("###DATA###");
  let corrections: unknown[] = [];
  let vocabHits: string[] = [];
  try {
    const parsed = JSON.parse((dataBlock ?? "{}").trim());
    corrections = parsed.corrections ?? [];
    vocabHits = parsed.vocabHits ?? [];
  } catch {
    // Model didn't return the data block cleanly — degrade gracefully.
  }

  return NextResponse.json({
    reply: replyText.trim(),
    corrections,
    vocabHits,
  });
    }
