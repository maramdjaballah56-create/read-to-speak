"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Send, Square, AlertCircle, CheckCircle2 } from "lucide-react";

type CorrectionType = "grammar" | "spelling" | "pronunciation" | "conjugation";

interface Correction {
  type: CorrectionType;
  original: string;
  fix: string;
  explanation: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "coach";
  text: string;
  corrections?: Correction[];
}

const UNIT_VOCAB = ["reef", "fragile", "drift", "current", "surface"];

const CORRECTION_LABEL: Record<CorrectionType, string> = {
  grammar: "Grammar",
  spelling: "Spelling",
  pronunciation: "Pronunciation",
  conjugation: "Conjugation",
};

export default function AIStudyPartner() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "intro", role: "coach", text: "Hi! Today we're talking about the ocean unit. Try to use words like reef, drift, or fragile as we chat — tell me about a body of water you've visited." },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [sending, setSending] = useState(false);
  const [wordCounts, setWordCounts] = useState<Record<string, number>>(
    Object.fromEntries(UNIT_VOCAB.map((w) => [w, 0]))
  );
  const [sessionScore, setSessionScore] = useState(78);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function countVocabHits(text: string) {
    const lower = text.toLowerCase();
    return UNIT_VOCAB.filter((w) => lower.includes(w));
  }

  async function sendToCoach(userText: string) {
    await new Promise((res) => setTimeout(res, 700));
    const hits = countVocabHits(userText);
    const mockCorrections: Correction[] = /goed|drived|swimmed/i.test(userText)
      ? [{ type: "conjugation", original: userText.match(/goed|drived|swimmed/i)?.[0] ?? "", fix: "went / drove / swam", explanation: "These are irregular past-tense verbs — they don't take '-ed'." }]
      : [];
    const reply = hits.length
      ? `Nice, you used "${hits.join(", ")}" correctly! Can you describe what it felt like to be near the water?`
      : "Good start — try weaving in one of today's words, like 'drift' or 'fragile', in your next sentence.";
    return { reply, corrections: mockCorrections, vocabHits: hits };
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text }]);

    const { reply, corrections, vocabHits } = await sendToCoach(text);

    if (vocabHits.length) {
      setWordCounts((prev) => {
        const next = { ...prev };
        vocabHits.forEach((w) => (next[w] = (next[w] ?? 0) + 1));
        return next;
      });
      setSessionScore((s) => Math.min(100, s + vocabHits.length * 2));
    }
    if (corrections.length) {
      setSessionScore((s) => Math.max(0, s - corrections.length * 4));
    }

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "coach", text: reply, corrections }]);
    setSending(false);
  }

  function toggleRecording() {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      setInput((prev) => (prev ? prev : "I saw the water drift near the reef."));
    }
  }

  return (
    <div className="flex h-screen flex-col bg-surface text-ink">
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">AI Study Partner</p>
          <h2 className="text-lg font-semibold">Unit: The Quiet Ocean</h2>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${sessionScore >= 70 ? "bg-purple-light text-purple-dark" : "bg-red-50 text-danger"}`}>
          {sessionScore >= 70 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
          Session score: {sessionScore}%
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "coach" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[75%] ${m.role === "coach" ? "" : "text-right"}`}>
                  <div className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "coach" ? "bg-panel text-ink" : "bg-purple text-white"}`}>
                    {m.text}
                  </div>
                  {m.corrections && m.corrections.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {m.corrections.map((c, i) => (
                        <div key={i} className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left text-xs">
                          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" />
                          <div>
                            <span className="font-semibold text-danger">{CORRECTION_LABEL[c.type]}:</span>{" "}
                            <span className="text-ink/70">"{c.original}" → "{c.fix}"</span>
                            <p className="mt-0.5 text-muted">{c.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sending && <div className="text-xs text-muted">Coach is thinking…</div>}
          </div>

          <div className="border-t border-line px-6 py-4">
            <div className="flex items-center gap-2 rounded-xl border border-line bg-panel px-3 py-2">
              <button
                onClick={toggleRecording}
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${isRecording ? "bg-danger text-white" : "bg-white text-muted border border-line"}`}
              >
                {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isRecording ? "Listening…" : "Speak or type your answer…"}
                className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-purple text-white disabled:opacity-30"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <aside className="hidden w-64 shrink-0 border-l border-line px-5 py-6 lg:block">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Target words used</h3>
          <div className="mt-4 space-y-3">
            {UNIT_VOCAB.map((w) => (
              <div key={w} className="flex items-center justify-between text-sm">
                <span className={wordCounts[w] > 0 ? "text-ink" : "text-muted"}>{w}</span>
                <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-semibold ${wordCounts[w] > 0 ? "bg-purple-light text-purple-dark" : "bg-panel text-muted"}`}>
                  {wordCounts[w]}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
                }
