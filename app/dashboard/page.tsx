"use client";

import { useMemo, useState } from "react";
import { Flame, BookOpen, ChevronRight, Trophy } from "lucide-react";

type Level = "A1" | "A2" | "B1" | "B2" | "C1";

interface Unit {
  id: string;
  title: string;
  theme: string;
  level: Level;
  category: string;
  progress: number;
  minutes: number;
}

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

const MOCK_UNITS: Unit[] = [
  { id: "u1", title: "The Quiet Ocean", theme: "Marine biology basics", level: "B1", category: "Science", progress: 62, minutes: 14 },
  { id: "u2", title: "Ordering at a Café", theme: "Everyday conversation", level: "A2", category: "Everyday", progress: 100, minutes: 9 },
  { id: "u3", title: "The Fox Who Learned Patience", theme: "Children's story", level: "A1", category: "Story", progress: 20, minutes: 7 },
  { id: "u4", title: "Why Cities Flood", theme: "Climate & infrastructure", level: "B2", category: "Podcast", progress: 0, minutes: 18 },
  { id: "u5", title: "Negotiating a Raise", theme: "Workplace English", level: "C1", category: "Everyday", progress: 0, minutes: 16 },
];

export default function Dashboard() {
  const [activeLevel, setActiveLevel] = useState<Level>("B1");
  const streakDays = 12;

  const unitsForLevel = useMemo(
    () => MOCK_UNITS.filter((u) => u.level === activeLevel),
    [activeLevel]
  );

  const continueUnit = useMemo(
    () => MOCK_UNITS.find((u) => u.progress > 0 && u.progress < 100) ?? MOCK_UNITS[0],
    []
  );

  return (
    <div className="min-h-screen bg-surface text-ink">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <p className="text-sm text-muted">Welcome back</p>
            <h1 className="text-2xl font-semibold sm:text-3xl">Ready for today's session?</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-sm text-muted">
            <Flame className="h-4 w-4 text-purple" />
            {streakDays}-day streak
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-panel p-6 mb-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="rounded-full bg-purple-light px-2.5 py-1 text-xs font-medium text-purple-dark">
                Continue · Level {continueUnit.level}
              </span>
              <h2 className="mt-3 text-xl font-semibold">{continueUnit.title}</h2>
              <p className="mt-1 text-sm text-muted">{continueUnit.theme}</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-purple px-4 py-2.5 text-sm font-semibold text-white">
              Resume <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={`rounded-full px-4 py-1.5 text-sm border ${
                activeLevel === lvl
                  ? "bg-purple text-white border-purple"
                  : "border-line text-muted"
              }`}
            >
              Level {lvl}
            </button>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-3">Level {activeLevel} shelf</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {unitsForLevel.map((unit) => (
            <button
              key={unit.id}
              className="rounded-xl border border-line bg-white p-4 text-left hover:bg-panel transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wide text-muted">{unit.category}</span>
                {unit.progress === 100 && <Trophy className="h-4 w-4 text-purple" />}
              </div>
              <h4 className="mt-2 font-semibold">{unit.title}</h4>
              <p className="mt-1 text-xs text-muted">{unit.theme}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-purple" style={{ width: `${unit.progress}%` }} />
                </div>
                <span className="text-[11px] text-muted">{unit.progress}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
