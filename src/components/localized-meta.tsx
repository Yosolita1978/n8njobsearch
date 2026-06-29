"use client";

import { useEffect } from "react";
import { useProgress } from "@/lib/progress";
import { ui } from "@/content/ui";

// The page metadata in layout.tsx is static (English), because it is rendered
// on the server and cannot read the client-side language toggle. Once the app
// hydrates and we know the chosen language, this component updates the live
// document head to match: the tab title, the SEO description, and <html lang>.
export function LocalizedMeta() {
  const { hydrated, lang } = useProgress();

  useEffect(() => {
    if (!hydrated) return;

    const meta = ui[lang].meta;
    document.title = meta.title;
    document.documentElement.lang = lang;

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.appendChild(description);
    }
    description.setAttribute("content", meta.description);
  }, [hydrated, lang]);

  return null;
}
