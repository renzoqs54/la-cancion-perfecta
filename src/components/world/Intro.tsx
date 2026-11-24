import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import lilyPink from "@/assets/lily-pink.webp";
import lilyWhite from "@/assets/lily-white.webp";
import lilyBouquet from "@/assets/lily-bouquet.webp";
import { Petals, Sparkles, DriftingButterfly, Fireflies } from "./Ambient";
import { WaxSeal, PetalSvg } from "./Art";
import { sfx } from "./sfx";
import { useWorld } from "./world";

export function Intro() {
  const { go } = useWorld();
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0); // 0 cerrado, 1 sello roto, 2 solapa abierta, 3 carta fuera

  function open() {
    if (stage) return;
    sfx.seal();
    setStage(1);
    setTimeout(() => setStage(2), 700);
    setTimeout(() => { setStage(3); sfx.paper(); }, 1500);
    setTimeout(() => go("garden"), 3600);
  }

  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[image:var(--gradient-dawn)] px-4 py-16">
      <div className="grain absolute inset-0 opacity-70" aria-hidden />
      <img src={lilyBouquet} alt="" aria-hidden className="sticker animate-sway pointer-events-none absolute -left-16 -bottom-10 w-56 sm:w-80 md:-left-10 md:w-96" />
      <img src={lilyPink} alt="" aria-hidden className="sticker animate-float pointer-events-none absolute -right-10 -top-6 w-40 rotate-12 sm:w-60 md:w-72" />
      <img src={lilyWhite} alt="" aria-hidden className="sticker animate-sway pointer-events-none absolute -bottom-12 -right-8 w-36 -rotate-6 sm:w-52 md:w-64" style={{ animationDelay: "-2s" }} />
      <img src={lilyWhite} alt="" aria-hidden className="sticker pointer-events-none absolute -left-6 top-6 hidden w-28 -rotate-[30deg] opacity-90 md:block" />
      <Sparkles count={14} />
      <Fireflies count={8} className="opacity-60" />
      <Petals count={16} />
      <DriftingButterfly delay={-6} duration={34} top={8} />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }} className="mb-6 font-hand text-2xl text-rose-deep">
          un mundo solo para nosotros
        </motion.p>

        {/* Sobre */}
        <motion.div initial={{ opacity: 0, y: 30, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: stage ? 0 : -2 }} transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }} className="relative aspect-[3/2] w-full" style={{ perspective: 1200 }}>
          {/* Carta que sale */}
          <motion.div
            className="paper absolute inset-x-[7%] top-[8%] z-10 flex h-[84%] flex-col items-center justify-center rounded-md px-6"
            animate={stage >= 3 ? { y: "-62%", scale: 1.04 } : { y: 0 }}
            transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <p className="font-serif text-lg italic text-ink/80">Querida Pili,</p>
            <p className="mt-1 font-hand text-xl text-rose-deep">bienvenida ♡</p>
          </motion.div>
          {/* Cuerpo */}
          <div className="paper absolute inset-0 z-20 rounded-lg" style={{ clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)" }}>
            <div className="absolute inset-x-0 bottom-0 h-[55%] rounded-b-lg bg-gradient-to-t from-blush/50 to-transparent" />
            <img src={lilyPink} alt="" aria-hidden className="absolute bottom-3 left-3 w-16 -rotate-12 sticker" />
            <div className="absolute bottom-6 right-6 text-right">
              <p className="font-hand text-3xl text-ink sm:text-4xl">Para Pilar ♡</p>
            </div>
          </div>
          {/* Cinta */}
          <div className="washi absolute left-[62%] top-[-4%] z-30 h-[108%] w-6 rotate-[8deg] opacity-80" aria-hidden />
          {/* Solapa */}
          <div
            className="absolute inset-x-0 top-0 z-30 h-[55%] origin-top"
            style={{ transform: stage >= 2 ? "rotateX(178deg)" : "rotateX(0deg)", transition: "transform 1s cubic-bezier(.3,.7,.2,1)", transformStyle: "preserve-3d", zIndex: stage >= 2 ? 5 : 30 }}
          >
            <div className="paper h-full w-full bg-blush" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
          </div>
          {/* Sello */}
          <div className="absolute left-1/2 top-[44%] z-40 h-16 w-16 -translate-x-1/2 -translate-y-1/2 drop-shadow-md">
            <WaxSeal broken={stage >= 1} />
          </div>
        </motion.div>

        <AnimatePresence>
          {stage >= 1 && (
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              {Array.from({ length: 14 }).map((_, i) => (
                <motion.div key={i} className="absolute left-1/2 top-1/2" initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x: Math.cos(i) * (120 + i * 10), y: Math.sin(i * 1.7) * 140 - 40, opacity: 0, rotate: i * 50 }} transition={{ duration: 2.2, ease: "easeOut" }}>
                  <PetalSvg className="h-5 w-4" tone={i % 2 ? "pink" : "white"} />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: stage >= 3 ? 0 : 1 }} transition={{ delay: stage ? 0 : 1, duration: 1 }} className="mt-10 max-w-sm font-serif text-xl italic leading-snug text-ink/80 sm:text-2xl">
          «Hay lugares que no necesitan existir para sentirse como un hogar».
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: stage ? 0 : 1, y: 0 }} transition={{ delay: stage ? 0 : 1.6, duration: 0.8 }} className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={open}
            disabled={stage > 0}
            className="group relative overflow-hidden rounded-full bg-rose-deep px-8 py-4 font-sans text-base tracking-wide text-primary-foreground shadow-[var(--paper-shadow)] transition hover:-translate-y-0.5 hover:bg-rose-deep/90 active:scale-95"
          >
            <span className="relative z-10">Abrir nuestro pequeño mundo ♡</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ivory/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
          </button>
          <button onClick={() => go("garden")} className="text-xs uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 hover:text-rose-deep hover:underline">
            Omitir animación
          </button>
        </motion.div>
      </div>

      {stage >= 3 && <motion.div className="pointer-events-none absolute inset-0 z-50 bg-ivory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.7 }} aria-hidden />}
    </section>
  );
}
