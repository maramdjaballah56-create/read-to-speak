"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

interface Story {
  id: string;
  title: string;
  level: string;
  category: string;
  color: string;
}

const STORIES: Story[] = [
  { id: "quiet-ocean", title: "The Quiet Ocean", level: "B1", category: "Science", color: "#9B87F0" },
  { id: "fox-patience", title: "The Fox Who Learned Patience", level: "A1", category: "Fable", color: "#7C6AE0" },
  { id: "lost-key", title: "The Lost Key", level: "A2", category: "Mystery", color: "#B7A6F5" },
  { id: "market-day", title: "Market Day", level: "A1", category: "Everyday Life", color: "#C9BDF7" },
  { id: "night-train", title: "The Night Train", level: "B2", category: "Adventure", color: "#8A79E8" },
  { id: "old-clock", title: "The Old Clock Tower", level: "B1", category: "Mystery", color: "#A491F2" },
];

export default function StoryLibrary() {
  return (
    <div className="min-h-screen bg-surface px-6 py-10 text-ink">
      <div className="mx-auto max-w-5xl">
        <span className="text-xs font-medium uppercase tracking-wide text-purple-dark">Story Library</span>
        <h1 className="mt-2 text-2xl font-semibold">Pick a story to read</h1>
        <p className="mt-1 text-sm text-muted">Tap any card to start reading, listening, and practicing.</p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {STORIES.map((story) => (
            <Link
              key={story.id}
              href={`/reading?story=${story.id}`}
              className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
            >
              <div
                className="flex h-28 items-center justify-center"
                style={{ backgroundColor: story.color }}
              >
                <BookOpen className="h-8 w-8 text-white/90" />
              </div>
              <div className="p-3">
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted">
                  {story.category} · {story.level}
                </span>
                <h3 className="mt-1 text-sm font-semibold leading-snug">{story.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
