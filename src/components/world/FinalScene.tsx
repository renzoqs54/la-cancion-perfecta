import { motion, useReducedMotion } from "motion/react";
import gardenNight from "@/assets/garden-night.webp";
import lilyWhite from "@/assets/lily-white.webp";
import lilyPink from "@/assets/lily-pink.webp";
import { Fireflies, Petals, Sparkles } from "./Ambient";

export function FinalScene() {
  const reducedMotion = useReducedMotion();

  return (
    <section aria-labelledby="final-heading" className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-night px-5 pb-28 pt-20 text-ivory sm:px-8">
      <img src={gardenNight} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/40 to-night/25" aria-hidden />
      <Sparkles count={22} />
      <Fireflies count={20} className="opacity-80" />
      <Petals count={16} intensity={0.7} />

      <motion.div
        initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reducedMotion ? 0 : 0.45, duration: reducedMotion ? 0 : 1.1 }}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <p className="font-hand text-2xl text-gold sm:text-3xl">Y, después de todo, volver a florecer</p>
        <h1 id="final-heading" className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">No quiero prometerte una historia perfecta.</h1>
        <p className="mt-5 max-w-2xl font-serif text-xl leading-relaxed text-ivory/90 sm:text-2xl">
          Quisiera que, si algún día ambos lo deseamos, podamos construir una en la que los dos nos sintamos en paz.
        </p>
        <motion.div
          initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.72, y: reducedMotion ? 0 : 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: reducedMotion ? 0 : 1.15, duration: reducedMotion ? 0 : 1.1 }}
          className="relative mt-10"
        >
          <img src={lilyWhite} alt="Lirio blanco" className="sticker relative z-10 mx-auto w-32 sm:w-40" />
          <img src={lilyPink} alt="" aria-hidden className="sticker absolute -bottom-2 -left-16 w-28 -rotate-12 opacity-90 sm:-left-24 sm:w-36" />
        </motion.div>
        <p className="mt-7 font-hand text-3xl text-ivory sm:text-4xl">Un mundo solo para nosotros ♡</p>
        <p className="mt-5 font-serif text-lg italic text-ivory/75">Gracias por tomarte el tiempo de recorrer este pequeño universo.</p>
        <p className="mt-8 font-hand text-2xl text-gold">Con cariño, Renzo.</p>
      </motion.div>
    </section>
  );
}