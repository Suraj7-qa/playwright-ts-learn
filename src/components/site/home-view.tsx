"use client";

import {
  ArrowRight,
  BookOpen,
  Code2,
  FlaskConical,
  Github,
  Layers,
  Terminal,
  Trophy,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Track, PracticeProblem } from "@/lib/types";

interface HomeViewProps {
  tsTrack: Track;
  pwTrack: Track;
  problemCount: number;
  onNavigate: (target: "typescript" | "playwright" | "problems" | "deploy") => void;
  problems: PracticeProblem[];
}

export function HomeView({
  tsTrack,
  pwTrack,
  problemCount,
  onNavigate,
}: HomeViewProps) {
  const totalLessons = tsTrack.lessons.length + pwTrack.lessons.length;
  const tsProblemCount = 8;
  const pwProblemCount = 8;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-emerald-50 via-emerald-50/30 to-amber-50 dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-amber-950/20 p-8 md:p-14 mb-10">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.08]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
        <div className="relative">
          <Badge variant="outline" className="mb-5 backdrop-blur-sm bg-white/60 dark:bg-black/30">
            <Zap className="h-3 w-3 mr-1.5 text-amber-500" />
            Beginner to interview-ready
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-[1.05]">
            Master <span className="text-emerald-600 dark:text-emerald-400">Playwright</span> with{" "}
            <span className="text-sky-600 dark:text-sky-400">TypeScript</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
            A hands-on curriculum that takes you from primitive types and your
            first <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">page.goto</code>{" "}
            all the way to generics, network mocking, and the interview questions
            that actually come up.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => onNavigate("typescript")} className="gap-2">
              Start with TypeScript
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate("playwright")}
              className="gap-2"
            >
              Jump to Playwright
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => onNavigate("deploy")}
              className="gap-2"
            >
              <Github className="h-4 w-4" />
              Deploy on GitHub Pages
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Lessons" value={`${totalLessons}`} icon={BookOpen} />
            <StatCard label="Practice problems" value={`${problemCount}`} icon={FlaskConical} />
            <StatCard label="Tracks" value="2" icon={Layers} />
            <StatCard label="100% TypeScript" value="Typed" icon={Code2} />
          </div>
        </div>
      </section>

      {/* Learning paths */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Choose your path
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TrackCard
            track={tsTrack}
            icon="TS"
            iconClass="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
            accent="text-sky-600 dark:text-sky-400"
            onClick={() => onNavigate("typescript")}
          />
          <TrackCard
            track={pwTrack}
            icon="PW"
            iconClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            accent="text-emerald-600 dark:text-emerald-400"
            onClick={() => onNavigate("playwright")}
          />
        </div>
      </section>

      {/* Practice */}
      <section className="mb-12">
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 p-3 shrink-0">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold mb-1">
                  Practice problems
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  {tsProblemCount} TypeScript challenges and {pwProblemCount}{" "}
                  Playwright scenarios. Reveal hints one at a time, then compare
                  your solution to the model answer.
                </p>
              </div>
            </div>
            <Button onClick={() => onNavigate("problems")} className="gap-2 self-start">
              Browse problems
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why this site */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Why this curriculum?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FeatureCard
            icon={Terminal}
            title="Runnable, copyable code"
            body="Every example is real TypeScript or real Playwright code you can paste into your project. No pseudo-code, no 'implementation left as exercise for the reader'."
          />
          <FeatureCard
            icon={Layers}
            title="Structural progression"
            body="Each lesson builds on the previous one. Skip ahead if you're already comfortable — the sidebar shows the difficulty badge on every lesson so you can self-assess."
          />
          <FeatureCard
            icon={Trophy}
            title="Interview-ready"
            body="Both tracks end with a dedicated interview-questions module. Model answers, follow-up questions, and the kind of depth that separates juniors from seniors."
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof BookOpen;
}) {
  return (
    <div className="rounded-lg border border-border bg-white/70 dark:bg-black/30 backdrop-blur-sm p-4">
      <Icon className="h-4 w-4 text-muted-foreground mb-2" />
      <p className="text-2xl md:text-3xl font-bold leading-none">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function TrackCard({
  track,
  icon,
  iconClass,
  accent,
  onClick,
}: {
  track: Track;
  icon: string;
  iconClass: string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left rounded-xl border border-border bg-card p-6 md:p-7 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={cn("rounded-lg font-mono font-bold text-sm w-12 h-12 flex items-center justify-center shrink-0", iconClass)}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={cn("text-xl md:text-2xl font-semibold", accent)}>
            {track.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {track.lessons.length} lessons · ~
            {track.lessons.reduce((s, l) => s + l.durationMinutes, 0)} min total
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {track.blurb}
      </p>
      <ul className="space-y-1.5">
        {track.lessons.map((l) => (
          <li
            key={l.id}
            className="flex items-center gap-2 text-sm text-foreground/80"
          >
            <span className={cn("font-mono text-xs", accent)}>·</span>
            {l.title}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
        <span className={accent}>Start track</span>
        <ArrowRight className={cn("h-4 w-4", accent)} />
      </div>
    </button>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof BookOpen;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <Icon className="h-5 w-5 text-primary mb-3" />
      <h3 className="font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
