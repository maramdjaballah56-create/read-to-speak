"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("nativeLanguage");
    router.replace(saved ? "/dashboard" : "/language");
  }, [router]);

  return null;
}
