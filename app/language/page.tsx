"use client";

import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "tr", label: "Türkçe" },
  { code: "de", label: "Deutsch" },
];

export default function LanguageSelectPage() {
  const router = useRouter();

  function choose(code: string) {
    localStorage.setItem("nativeLanguage", code);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6 py-10 text-ink">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-purple-light">
          <Globe className="h-7 w-7 text-purple-dark" />
        </div>
        <h1 className="mt-4 text-xl font-semibold">What's your native language?</h1>
        <p className="mt-1 text-sm text-muted">We'll use this to explain things more clearly.</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => choose(lang.code)}
              className="rounded-xl border border-line bg-white py-3 text-sm font-medium hover:bg-panel"
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
