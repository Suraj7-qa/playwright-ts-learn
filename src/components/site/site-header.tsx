"use client";

import { useState } from "react";
import { Moon, Sun, Menu, Github } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import type { Track } from "@/lib/types";
import { useMounted } from "@/hooks/use-mounted";

interface SiteHeaderProps {
  tsTrack: Track;
  pwTrack: Track;
  currentSection: "home" | "typescript" | "playwright" | "problems" | "deploy";
  currentLessonId: string | null;
  onSelectSection: (s: "home" | "typescript" | "playwright" | "problems" | "deploy") => void;
  onSelectLesson: (trackId: string, lessonId: string) => void;
}

export function SiteHeader({
  tsTrack,
  pwTrack,
  currentSection,
  currentLessonId,
  onSelectSection,
  onSelectLesson,
}: SiteHeaderProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        {/* Mobile sidebar trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-4 overflow-y-auto">
            <SheetTitle className="text-left mb-1">Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Curriculum navigation menu
            </SheetDescription>
            <Sidebar
              tsTrack={tsTrack}
              pwTrack={pwTrack}
              currentSection={currentSection}
              currentLessonId={currentLessonId}
              onSelectSection={(s) => {
                onSelectSection(s);
                setMobileOpen(false);
              }}
              onSelectLesson={(t, l) => {
                onSelectLesson(t, l);
                setMobileOpen(false);
              }}
            />
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <button
          onClick={() => onSelectSection("home")}
          className="flex items-center gap-2 mr-auto"
        >
          <div className="flex items-center -space-x-1">
            <div className="w-7 h-7 rounded-md bg-sky-600 text-white grid place-items-center font-mono text-xs font-bold">
              TS
            </div>
            <div className="w-7 h-7 rounded-md bg-emerald-600 text-white grid place-items-center font-mono text-xs font-bold border-2 border-background">
              PW
            </div>
          </div>
          <span className="font-semibold tracking-tight text-base md:text-lg">
            Playwright<span className="text-muted-foreground">+</span>TS
          </span>
        </button>

        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:inline-flex"
          asChild
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4 mr-1.5" />
            GitHub
          </a>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
