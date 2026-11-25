import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BookOpen, Pause, Play } from "lucide-react";
import lilyWhite from "@/assets/lily-white.webp";
import { Button } from "@/components/ui/button";
import { LETTER } from "@/data/letter";
import { useWorld } from "./world";

function formatParagraph(text: string) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold text-rose-deep">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export function LetterScene() {
  const { go } = useWorld();
  const reducedMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(1);
  const [paused, setPaused] = useState(false);
  const finished = visibleCount >= LETTER.length;
  const progress = Math.round((visibleCount / LETTER.length) * 100);

  useEffect(() => {
    if (finished || paused) return;
    if (reducedMotion) {
      setVisibleCount(LETTER.length);
      return;
    }
    const timer = window.setTimeout(() => {
      setVisibleCount((current) => Math.min(current + 1, LETTER.length));
    }, 460);
    return () => window.clearTimeout(timer);
  }, [finished, paused, reducedMotion]);

  function readAll() {
    setVisibleCount(LETTER.length);
    setPaused(true);
  }

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[image:var(--gradient-dawn)] px-4 pb-32 pt-20 sm:px-8 sm:pt-24">
      <div className="grain pointer-events-none absolute inset-0 opacity-35" aria-hidden />
      <img src={lilyWhite} alt="" aria-hidden className="sticker pointer-events-none absolute -right-12 top-28 hidden w-48 rotate-12 opacity-70 sm:block" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <header className="mx-auto mb-9 max-w-2xl text-center">
          <p className="font-hand text-2xl text-rose-deep">Una carta para Pilar</p>
          <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">Lo que quisiera que supieras...</h1>
          <p className="mt-3 font-serif text-xl italic text-ink/70">Hay sentimientos que merecen ser expresados con calma.</p>
        </header>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-rose-antique/30 pb-4">
          <p className="font-sans text-sm text-muted-foreground">Lectura · {progress}%</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPaused((current) => !current)} disabled={finished}>
              {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
              {paused ? "Continuar" : "Pausar"}
            </Button>
            <Button variant="ghost" size="sm" onClick={readAll} disabled={finished}>
              <BookOpen aria-hidden /> Leer toda la carta
            </Button>
          </div>
        </div>
        <div
          role="progressbar"
          aria-label="Progreso de lectura"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="mb-8 h-1.5 overflow-hidden rounded-full bg-rose-antique/20"
        >
          <div className="h-full rounded-full bg-rose-deep transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>

        <article className="paper deckle relative border border-rose-antique/25 px-6 py-9 shadow-[var(--paper-shadow)] sm:px-12 sm:py-14">
          <div className="washi absolute -top-3 left-1/2 h-6 w-28 -translate-x-1/2 -rotate-2 opacity-90" aria-hidden />
          <div className="mx-auto max-w-[68ch] space-y-5 font-serif text-lg leading-relaxed text-ink sm:text-xl sm:leading-[1.8]">
            {LETTER.slice(0, visibleCount).map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.48 }}
              >
                {formatParagraph(paragraph)}
              </motion.p>
            ))}
          </div>
        </article>

        {finished && (
          <motion.footer
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.8 }}
            className="mx-auto flex max-w-xl flex-col items-center px-6 pb-8 pt-10 text-center"
          >
            <img src={lilyWhite} alt="Lirio blanco" className="sticker animate-bloom mb-3 w-24" />
            <p className="font-serif text-xl italic leading-relaxed text-ink/75">
              «Hay cosas que no necesitan una respuesta inmediata. Algunas simplemente merecen ser expresadas».
            </p>
            <Button className="mt-7" onClick={() => go("song")}>
              Continuar a la canción <ArrowRight aria-hidden />
            </Button>
          </motion.footer>
        )}
      </div>
    </section>
  );
}