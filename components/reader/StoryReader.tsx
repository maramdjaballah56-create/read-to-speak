"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, X } from "lucide-react";

interface WordInfo {
  word: string;
  partOfSpeech: string;
  definition: string;
  contextNote: string;
}

const MOCK_DICTIONARY: Record<string, WordInfo> = {
  reef: { word: "reef", partOfSpeech: "noun", definition: "A ridge of rock or coral near the ocean's surface.", contextNote: "Here it refers to the coral reef the divers are exploring." },
  fragile: { word: "fragile", partOfSpeech: "adjective", definition: "Easily broken or damaged; delicate.", contextNote: "Describes how easily the coral ecosystem can be harmed." },
  drift: { word: "drift", partOfSpeech: "verb", definition: "To be carried slowly by water or air currents.", contextNote: "Used for how the current moves the diver along." },
};

const STORY_PARAGRAPHS = [
  "Beneath the surface, the reef was quiet in a way that felt almost alive. Maria let herself drift with the current, watching light fracture across a thousand fragile shapes.",
  "She had read about coral before, but nothing prepared her for how still it made her feel — like the ocean was listening back.",
];

function tokenize(text: string) {
  return text.split(/(\s+)/).filter(Boolean);
}

export default function StoryReader() {
  const [selected, setSelected] = useState<WordInfo | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setSelected(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function lookupWord(rawWord: string, target: HTMLElement) {
    const clean = rawWord.toLowerCase().replace(/[^a-z'-]/g, "");
    if (!clean) return;
    setAnchorRect(target.getBoundingClientRect());
    const info: WordInfo = MOCK_DICTIONARY[clean] ?? {
      word: clean,
      partOfSpeech: "—",
      definition: "Definition not found in this unit's glossary yet.",
      contextNote: "Try one of the highlighted target-vocabulary words.",
    };
    setSelected(info);
  }

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.92;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  const isTargetWord = (clean: string) =>
    Object.prototype.hasOwnProperty.call(MOCK_DICTIONARY, clean.toLowerCase());

  return (
    <div className="min-h-screen bg-surface px-6 py-10 text-ink">
      <div className="mx-auto max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-wide text-purple-dark">Level B1 · Science</span>
        <h1 className="mt-2 text-3xl font-semibold">The Quiet Ocean</h1>

        <button
          onClick={() => speak(STORY_PARAGRAPHS.join(" "))}
          className="mt-4 flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-sm text-ink"
        >
          <Volume2 className="h-4 w-4 text-purple" />
          Listen to full passage
        </button>

        <article className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-10">
          {STORY_PARAGRAPHS.map((para, i) => (
            <p key={i} className="mb-5 text-lg leading-relaxed last:mb-0 sm:text-xl sm:leading-[1.8]">
              {tokenize(para).map((token, j) => {
                if (/^\s+$/.test(token)) return token;
                const clean = token.replace(/[^a-zA-Z'-]/g, "");
                const target = isTargetWord(clean);
                return (
                  <span
                    key={j}
                    onClick={(e) => lookupWord(clean, e.currentTarget)}
                    className={`cursor-pointer rounded px-0.5 hover:bg-purple-light ${
                      target ? "underline decoration-purple decoration-2 underline-offset-4" : ""
                    }`}
                  >
                    {token}
                  </span>
                );
              })}
            </p>
          ))}
        </article>

        <p className="mt-4 text-center text-xs text-muted">
          Tap any word for its meaning and pronunciation. Underlined words are this unit's target vocabulary.
        </p>
      </div>

      {selected && anchorRect && (
        <div
          ref={popoverRef}
          style={{
            position: "fixed",
            top: anchorRect.bottom + 8,
            left: Math.min(anchorRect.left, window.innerWidth - 300),
          }}
          className="z-50 w-72 rounded-xl border border-line bg-white p-4 shadow-xl"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-lg font-semibold">{selected.word}</span>
              <span className="ml-2 text-xs italic text-muted">{selected.partOfSpeech}</span>
            </div>
            <button onClick={() => setSelected(null)} className="text-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-sm text-ink">{selected.definition}</p>
          <p className="mt-1 text-xs italic text-muted">{selected.contextNote}</p>
          <button
            onClick={() => speak(selected.word)}
            className="mt-3 flex items-center gap-2 rounded-lg bg-purple-light px-3 py-1.5 text-xs font-medium text-purple-dark"
          >
            <Volume2 className="h-3.5 w-3.5" />
            Hear pronunciation
          </button>
        </div>
      )}
    </div>
  );
}
