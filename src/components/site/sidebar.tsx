"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronRight,
  FlaskConical,
  Home,
  Rocket,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Track } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type SectionId = "home" | "typescript" | "playwright" | "problems" | "deploy";

interface SidebarProps {
  tsTrack: Track;
  pwTrack: Track;
  currentSection: SectionId;
  currentLessonId: string | null;
  onSelectSection: (section: SectionId) => void;
  onSelectLesson: (trackId: string, lessonId: string) => void;
}

const NAV_ITEMS: { id: SectionId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "typescript", label: "TypeScript", icon: Code2 },
  { id: "playwright", label: "Playwright", icon: BookOpen },
  { id: "problems", label: "Practice", icon: FlaskConical },
  { id: "deploy", label: "Deploy", icon: Rocket },
];

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  advanced: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  interview: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
};

export function Sidebar({
  tsTrack,
  pwTrack,
  currentSection,
  currentLessonId,
  onSelectSection,
  onSelectLesson,
}: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    typescript: true,
    playwright: true,
  });

  const toggle = (id: string) =>
    setExpanded((s) => ({ ...s, [id]: !s[id] }));

  return (
    <nav className="space-y-1" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentSection === item.id;
        const isExpandable = item.id === "typescript" || item.id === "playwright";
        const track = item.id === "typescript" ? tsTrack : item.id === "playwright" ? pwTrack : null;
        const isOpen = expanded[item.id] ?? false;

        return (
          <div key={item.id}>
            <button
              onClick={() => {
                if (isExpandable && !isActive) {
                  toggle(item.id);
                }
                onSelectSection(item.id);
                if (isExpandable) toggle(item.id);
              }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {isExpandable ? (
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-transform",
                    isOpen ? "rotate-90" : ""
                  )}
                />
              ) : null}
            </button>

            {isExpandable && track && isOpen ? (
              <ul className="mt-1 ml-4 pl-3 border-l border-border space-y-0.5">
                {track.lessons.map((lesson) => {
                  const isLessonActive =
                    isActive && currentLessonId === lesson.id;
                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() =>
                          onSelectLesson(track.id, lesson.id)
                        }
                        className={cn(
                          "w-full flex items-start gap-2 px-2.5 py-1.5 rounded-md text-[13px] leading-tight transition-colors text-left",
                          isLessonActive
                            ? "bg-muted text-foreground font-medium"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        )}
                      >
                        <CheckCircle2
                          className={cn(
                            "h-3.5 w-3.5 mt-0.5 shrink-0",
                            isLessonActive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground/40"
                          )}
                        />
                        <span className="flex-1 min-w-0">
                          <span className="block truncate">{lesson.title}</span>
                          <span className="flex items-center gap-1 mt-0.5">
                            <Badge
                              variant="outline"
                              className={cn(
                                "px-1 py-0 text-[10px] leading-none h-4",
                                DIFFICULTY_STYLES[lesson.difficulty]
                              )}
                            >
                              {lesson.difficulty.slice(0, 4)}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {lesson.durationMinutes}m
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
