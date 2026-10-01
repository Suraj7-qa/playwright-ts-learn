"use client";

import { useEffect, useMemo, useState } from "react";
import { typescriptTrack } from "@/data/typescript-curriculum";
import { playwrightTrack } from "@/data/playwright-curriculum";
import { practiceProblems } from "@/data/problems";
import { Sidebar } from "@/components/site/sidebar";
import { SiteHeader } from "@/components/site/site-header";
import { HomeView } from "@/components/site/home-view";
import { LessonView } from "@/components/site/lesson-view";
import { ProblemsView } from "@/components/site/problems-view";
import { DeploymentView } from "@/components/site/deployment-view";
import { ScrollArea } from "@/components/ui/scroll-area";

type SectionId = "home" | "typescript" | "playwright" | "problems" | "deploy";

export default function Home() {
  const [section, setSection] = useState<SectionId>("home");
  const [lessonId, setLessonId] = useState<string | null>(null);

  // Scroll to top whenever the user navigates.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [section, lessonId]);

  const selectSection = (s: SectionId) => {
    setSection(s);
    if (s !== "typescript" && s !== "playwright") {
      setLessonId(null);
    } else {
      // Pick the first lesson of the track if none selected yet.
      const track = s === "typescript" ? typescriptTrack : playwrightTrack;
      setLessonId((current) => current ?? track.lessons[0]?.id ?? null);
    }
  };

  const selectLesson = (trackId: string, lid: string) => {
    setSection(trackId as SectionId);
    setLessonId(lid);
  };

  const currentLesson = useMemo(() => {
    if (section !== "typescript" && section !== "playwright") return null;
    const track = section === "typescript" ? typescriptTrack : playwrightTrack;
    return track.lessons.find((l) => l.id === lessonId) ?? track.lessons[0] ?? null;
  }, [section, lessonId]);

  const currentTrack =
    section === "typescript" ? typescriptTrack : section === "playwright" ? playwrightTrack : null;

  const breadcrumb =
    section === "home"
      ? "Home"
      : section === "problems"
      ? "Practice Problems"
      : section === "deploy"
      ? "Deploy"
      : currentTrack
      ? `${currentTrack.name}${currentLesson ? ` / ${currentLesson.title}` : ""}`
      : "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader
        tsTrack={typescriptTrack}
        pwTrack={playwrightTrack}
        currentSection={section}
        currentLessonId={lessonId}
        onSelectSection={selectSection}
        onSelectLesson={selectLesson}
      />

      <div className="flex-1 flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-72 lg:w-80 shrink-0 border-r border-border bg-muted/30">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
            <Sidebar
              tsTrack={typescriptTrack}
              pwTrack={playwrightTrack}
              currentSection={section}
              currentLessonId={lessonId}
              onSelectSection={selectSection}
              onSelectLesson={selectLesson}
            />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-4xl px-4 md:px-8 lg:px-12 py-8 md:py-12">
            {section !== "home" ? (
              <nav className="text-xs text-muted-foreground mb-6 font-mono">
                {breadcrumb}
              </nav>
            ) : null}

            {section === "home" ? (
              <HomeView
                tsTrack={typescriptTrack}
                pwTrack={playwrightTrack}
                problemCount={practiceProblems.length}
                problems={practiceProblems}
                onNavigate={(s) => selectSection(s)}
              />
            ) : null}

            {section === "typescript" || section === "playwright" ? (
              currentLesson ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <h2 className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                      {currentTrack?.name} track
                    </h2>
                  </div>
                  <LessonView lesson={currentLesson} />
                </>
              ) : null
            ) : null}

            {section === "problems" ? (
              <ProblemsView problems={practiceProblems} />
            ) : null}

            {section === "deploy" ? <DeploymentView /> : null}
          </div>

          <footer className="mt-auto border-t border-border bg-muted/30">
            <div className="mx-auto max-w-4xl px-4 md:px-8 lg:px-12 py-6 text-xs text-muted-foreground">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <p>
                  Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.
                  Deploy on GitHub Pages in four steps — see the Deploy section.
                </p>
                <p className="font-mono">
                  Playwright<span className="text-muted-foreground/60">+</span>TS Learn
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
