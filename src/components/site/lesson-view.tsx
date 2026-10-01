"use client";

import { Info, Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { CodeBlock } from "./code-block";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  advanced: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  interview: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
};

const CALLOUT_CONFIG = {
  info: {
    icon: Info,
    className: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100",
    iconClass: "text-sky-600 dark:text-sky-400",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  tip: {
    icon: Lightbulb,
    className: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  success: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
};

export function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <article className="prose-content max-w-none">
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge
            variant="outline"
            className={DIFFICULTY_STYLES[lesson.difficulty]}
          >
            {lesson.difficulty}
          </Badge>
          <Badge variant="outline" className="font-mono">
            {lesson.durationMinutes} min
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          {lesson.title}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {lesson.description}
        </p>
        <div className="mt-5 rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            What you&apos;ll learn
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {lesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <Separator className="my-8" />

      <div className="space-y-12">
        {lesson.sections.map((section, i) => {
          const callout = section.callout ? CALLOUT_CONFIG[section.callout.type] : null;
          const CalloutIcon = callout?.icon;
          return (
            <section key={i} id={`section-${i}`} className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 tracking-tight">
                {section.heading}
              </h2>

              {section.callout && CalloutIcon ? (
                <div
                  className={`mb-5 rounded-lg border p-4 flex gap-3 ${callout!.className}`}
                >
                  <CalloutIcon className={`h-5 w-5 mt-0.5 shrink-0 ${callout!.iconClass}`} />
                  <div className="text-sm leading-relaxed">
                    {section.callout.title ? (
                      <p className="font-semibold mb-1">{section.callout.title}</p>
                    ) : null}
                    <p>{section.callout.text}</p>
                  </div>
                </div>
              ) : null}

              <div className="space-y-4">
                {section.body.map((para, j) => (
                  <p key={j} className="text-[15px] leading-7 text-foreground/90">
                    {para}
                  </p>
                ))}
              </div>

              {section.code && section.code.length > 0 ? (
                <div className="mt-5">
                  {section.code.map((ex, k) => (
                    <CodeBlock
                      key={k}
                      code={ex.code}
                      language={ex.language}
                      caption={ex.caption}
                    />
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <Separator className="my-10" />
      <p className="text-sm text-muted-foreground">
        Lesson complete. Use the sidebar to move to the next lesson, or jump
        into the practice problems to test what you learned.
      </p>
    </article>
  );
}
