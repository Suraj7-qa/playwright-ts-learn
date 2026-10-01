"use client";

import { useState } from "react";
import {
  ChevronRight,
  Lightbulb,
  Code2,
  Eye,
  EyeOff,
  Tag,
} from "lucide-react";
import type { PracticeProblem } from "@/lib/types";
import { CodeBlock } from "./code-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  advanced: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  interview: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
};

export function ProblemsView({
  problems,
}: {
  problems: PracticeProblem[];
}) {
  const [filter, setFilter] = useState<"all" | "typescript" | "playwright">("all");

  const visible =
    filter === "all" ? problems : problems.filter((p) => p.category === filter);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Practice Problems
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
          Sharpen your TypeScript and Playwright skills with hands-on problems.
          Each card has a prompt, progressive hints, a runnable solution, and a
          written explanation. Try the problem first — reveal hints only when
          you&apos;re truly stuck.
        </p>
      </header>

      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as typeof filter)}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">All ({problems.length})</TabsTrigger>
          <TabsTrigger value="typescript">
            TypeScript ({problems.filter((p) => p.category === "typescript").length})
          </TabsTrigger>
          <TabsTrigger value="playwright">
            Playwright ({problems.filter((p) => p.category === "playwright").length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-5">
        {visible.map((p) => (
          <ProblemCard key={p.id} problem={p} />
        ))}
      </div>
    </div>
  );
}

function ProblemCard({ problem }: { problem: PracticeProblem }) {
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [expanded, setExpanded] = useState(true);

  return (
    <article className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <header
        className="flex items-start gap-3 p-5 cursor-pointer hover:bg-muted/40 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <ChevronRight
          className={`h-5 w-5 mt-0.5 shrink-0 transition-transform ${
            expanded ? "rotate-90" : ""
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Badge
              variant="outline"
              className={DIFFICULTY_STYLES[problem.difficulty]}
            >
              {problem.difficulty}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {problem.category}
            </Badge>
            {problem.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="font-mono text-xs"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="text-lg md:text-xl font-semibold leading-snug">
            {problem.title}
          </h3>
        </div>
      </header>

      {expanded ? (
        <div className="px-5 pb-5 -mt-1">
          <div className="pl-8">
            <div className="space-y-3 mb-5">
              {problem.prompt.map((line, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-7 text-foreground/90"
                >
                  {line}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowHints((v) => !v)}
              >
                <Lightbulb className="h-4 w-4 mr-1.5" />
                {showHints ? "Hide hints" : "Show hints"}
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({problem.hints.length})
                </span>
              </Button>
              <Button
                type="button"
                variant={showSolution ? "secondary" : "default"}
                size="sm"
                onClick={() => setShowSolution((v) => !v)}
              >
                {showSolution ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1.5" /> Hide solution
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1.5" /> Reveal solution
                  </>
                )}
              </Button>
            </div>

            {showHints ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4 mb-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Hints (reveal one at a time mentally — try before peeking)
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-sm text-amber-900 dark:text-amber-100">
                  {problem.hints.map((hint, i) => (
                    <li key={i} className="leading-relaxed">{hint}</li>
                  ))}
                </ol>
              </div>
            ) : null}

            {showSolution ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Code2 className="h-4 w-4" />
                  Solution
                </div>
                <CodeBlock
                  code={problem.solutionCode.code}
                  language={problem.solutionCode.language}
                />
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Explanation
                  </p>
                  <div className="space-y-2">
                    {problem.explanation.map((para, i) => (
                      <p key={i} className="text-sm leading-6 text-foreground/90">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
