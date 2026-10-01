"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  caption?: string;
  className?: string;
}

// react-syntax-highlighter accepts a slightly different language registry
// than what we author in (e.g. "typescript" vs "ts"). Map common aliases.
const LANGUAGE_ALIASES: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  sh: "bash",
  yml: "yaml",
};

export function CodeBlock({ code, language, caption, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const resolved = LANGUAGE_ALIASES[language] ?? language;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can fail in restricted contexts (e.g. inside an iframe).
      // Fall back to a textarea execCommand copy.
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  return (
    <figure className={cn("my-5 group relative", className)}>
      <div className="rounded-lg overflow-hidden border border-border bg-[#282c34]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
          <span className="text-xs font-mono uppercase tracking-wide text-zinc-300">
            {language}
          </span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy
              </>
            )}
          </button>
        </div>
        <SyntaxHighlighter
          language={resolved}
          style={oneDark}
          customStyle={{
            margin: 0,
            background: "transparent",
            padding: "1rem 1.25rem",
            fontSize: "0.85rem",
            lineHeight: 1.55,
          }}
          codeTagProps={{
            style: { fontFamily: "var(--font-geist-mono), monospace" },
          }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      {caption ? (
        <figcaption className="mt-2 text-xs text-muted-foreground italic">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
