import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import gardenBg from "@/assets/garden-bg.webp";
import lilyPink from "@/assets/lily-pink.webp";
import lilyWhite from "@/assets/lily-white.webp";
import lilyBouquet from "@/assets/lily-bouquet.webp";
import { DriftingButterfly, Fireflies, Petals, Sparkles } from "./Ambient";
import { BottleSvg, ButterflySvg, EnvelopeSvg, LeafSvg, NoteSvg, PetalSvg, StarSvg } from "./Art";
import { Keepsake } from "./Keepsake";
import { sfx } from "./sfx";
import { useWorld } from "./world";

type Open = null | "lily" | "star" | "butterfly" | "bottle" | "tiny" | "secret";

const HIDDEN_PHRASES = ["sigues siendo mi lugar favorito", "tu risa sigue sonando aquí", "si se pone difícil, lo hacemos fácil"];

function useParallax() {
  const [p, setP] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const m = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setP({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 }));
    };
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, []);
  return p;
}

function Hotspot({ label, hint, onClick, className = "", children }: { label: string; hint: string; onClick: () => void; className?: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} className={`group absolute flex flex-col items-center outline-none ${className}`}>
      <span className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ivory/80" style={{ animation: "pulse-ring 2.8s ease-out infinite" }} aria-hidden />
      <span className="relative transition-transform duration-500 group-hover:scale-110 group-focus-visible:scale-110 group-active:scale-95">{children}</span>
      <span className="mt-1 rounded-full bg-ivory/85 px-3 py-1 font-hand text-lg leading-none text-rose-deep opacity-90 shadow-sm backdrop-blur transition group-hover:opacity-100">{hint}</span>
    </button>
  );
}

export function Garden() {
  const { go } = useWorld();
  const p = useParallax();
  const [open, setOpen] = useState<Open>(null);
  const [starLit, setStarLit] = useState(false);
  const [flowerTaps, setFlowerTaps] = useState(0);
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);
  const [twinkleStar, setTwinkleStar] = useState(0);
  const tid = useRef(0);

  const show = (o: Open) => { sfx.discover(); setOpen(o); };
  const layer = (d: number) => ({ transform: `translate3d(${p.x * d}px, ${p.y * d * 0.6}px, 0)`, transition: "transform .6s cubic-bezier(.2,.7,.2,1)" });

  function tapSecretFlower() {
    sfx.tap();
    const n = flowerTaps + 1;
    setFlowerTaps(n);
    if (n % 3 === 0) show("secret");
  }

  function butterflyTrail(e: React.PointerEvent) {
    const r = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
    const id = ++tid.current;
    setTrail((t) => [...t.slice(-12), { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setTrail((t) => t.filter((x) => x.id !== id)), 1800);
  }

  return (
    <section className="relative min-h-dvh overflow-hidden">
      {/* Fondo lejano */}
      <div className="absolute inset-[-3%] bg-cover bg-center" style={{ backgroundImage: `url(${gardenBg})`, ...layer(-8) }} aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-ivory/40 via-transparent to-ivory/30" aria-hidden />
      <Sparkles count={16} />
      <Fireflies count={14} className="opacity-80" />
      <DriftingButterfly delay={-10} duration={44} top={20} />

      {/* Mensaje de bienvenida */}
      <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="relative z-20 mx-auto max-w-2xl px-6 pt-20 text-center sm:pt-16">
        <h1 className="font-serif text-4xl font-medium leading-tight text-ink sm:text-6xl">
          Bienvenida a este pequeño universo, <em className="text-rose-deep">Pili</em>.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink/75 sm:text-lg">
          Un lugar hecho de recuerdos, canciones, flores y cosas que todavía quisiera compartir contigo.
        </p>
        <p className="mt-3 font-hand text-xl text-rose-deep sm:text-2xl">Puedes explorar cada rincón. Algunas flores guardan pequeños secretos.</p>
      </motion.header>

      {/* Escena interactiva */}
      <div className="relative z-10 mx-auto mt-6 h-[78vh] min-h-[560px] w-full max-w-6xl" onPointerMove={open ? undefined : undefined}>
        {/* Estrella */}
        <div style={layer(14)} className="absolute left-[8%] top-[2%] sm:left-[16%]">
          <Hotspot label="La estrella: una pequeña promesa" hint="una promesa" onClick={() => { setStarLit(true); show("star"); }}>
            <StarSvg className={`h-14 w-14 transition-all duration-700 sm:h-16 sm:w-16 ${starLit ? "drop-shadow-[0_0_18px_var(--gold)]" : ""}`} style={{ animation: "float-y 4s ease-in-out infinite" }} />
          </Hotspot>
        </div>

        {/* Estrella que cambia de brillo (secreto) */}
        <button aria-label="Una estrella pequeña que cambia de brillo" onClick={() => { sfx.tap(); setTwinkleStar((v) => (v + 1) % 4); }} className="absolute right-[12%] top-[0%] p-3" style={layer(18)}>
          <StarSvg className="h-6 w-6 transition-all duration-500" style={{ opacity: [0.45, 0.75, 1, 1][twinkleStar], filter: twinkleStar === 3 ? "drop-shadow(0 0 14px var(--gold))" : undefined, transform: `scale(${1 + twinkleStar * 0.2})` }} />
        </button>

        {/* Mariposa */}
        <div style={layer(20)} className="absolute right-[6%] top-[16%] sm:right-[22%]" onPointerMove={butterflyTrail}>
          <Hotspot label="La mariposa: los recuerdos" hint="recuerdos" onClick={() => show("butterfly")}>
            <motion.div animate={open === "butterfly" ? { x: 0, y: 0 } : { x: [0, 20, -10, 0], y: [0, -14, 6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
              <ButterflySvg className="sticker h-16 w-20" flutter={open !== "butterfly"} />
            </motion.div>
          </Hotspot>
        </div>
        {trail.map((t) => (
          <motion.div key={t.id} className="pointer-events-none absolute z-20" style={{ left: t.x, top: t.y }} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: 40, rotate: 120 }} transition={{ duration: 1.6 }} aria-hidden>
            <PetalSvg className="h-4 w-3" />
          </motion.div>
        ))}

        {/* Lirio grande */}
        <div style={layer(26)} className="absolute bottom-[6%] left-[-6%] w-[58%] max-w-[420px] sm:left-[4%] sm:w-[34%]">
          <button onClick={() => show("lily")} aria-label="El lirio: una pequeña dedicatoria" className="group relative block w-full">
            <img src={lilyPink} alt="Lirio rosado en acuarela" className="sticker animate-sway w-full transition-transform duration-700 group-hover:rotate-3 group-hover:scale-[1.04]" />
            <span className="absolute right-[6%] top-[8%] rounded-full bg-ivory/85 px-3 py-1 font-hand text-lg text-rose-deep shadow-sm">una dedicatoria</span>
          </button>
        </div>

        {/* Sobre */}
        <div style={layer(16)} className="absolute bottom-[34%] left-1/2 -translate-x-1/2 sm:bottom-[30%]">
          <Hotspot label="El sobre: nuestra carta" hint="nuestra carta" onClick={() => go("letter")}>
            <div className="relative">
              <EnvelopeSvg className="h-20 w-28 drop-shadow-lg sm:h-24 sm:w-32" />
              <img src={lilyPink} alt="" aria-hidden className="absolute -right-3 -top-4 w-10 rotate-12 sticker" />
            </div>
          </Hotspot>
        </div>

        {/* Nota musical */}
        <div style={layer(22)} className="absolute bottom-[8%] right-[2%] w-[40%] max-w-[280px] sm:right-[8%] sm:w-[22%]">
          <img src={lilyWhite} alt="" aria-hidden className="sticker animate-sway pointer-events-none w-full" style={{ animationDelay: "-3s" }} />
          <div className="absolute left-[-20%] top-[10%]">
            <Hotspot label="La nota musical: nuestra canción" hint="nuestra canción" onClick={() => go("song")}>
              <div className="relative">
                <NoteSvg className="h-14 w-14 rounded-full bg-ivory/80 p-2 shadow-md" style={{ animation: "float-y 3.5s ease-in-out infinite" }} />
                <PetalSvg className="absolute -left-3 top-0 h-4 w-3 rotate-[-30deg]" />
                <PetalSvg className="absolute -right-2 bottom-0 h-4 w-3 rotate-45" tone="deep" />
              </div>
            </Hotspot>
          </div>
        </div>

        {/* Ramillete — flor secreta (tocar varias veces) */}
        <button onClick={tapSecretFlower} aria-label="Una flor tímida: tócala varias veces" className="absolute bottom-[2%] left-[40%] w-[22%] max-w-[170px] sm:left-[34%] sm:w-[13%]" style={layer(30)}>
          <img src={lilyBouquet} alt="" aria-hidden className="sticker w-full transition-transform duration-300" style={{ transform: `rotate(${(flowerTaps % 3) * 4 - 4}deg) scale(${1 + (flowerTaps % 3) * 0.04})` }} />
          {flowerTaps % 3 > 0 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-hand text-lg text-rose-deep">{"♡".repeat(flowerTaps % 3)}</span>}
        </button>

        {/* Botella */}
        <button onClick={() => show("bottle")} aria-label="Una botella con un mensaje" className="absolute bottom-[22%] right-[38%] hidden p-2 transition hover:-rotate-6 sm:block" style={layer(12)}>
          <BottleSvg className="h-14 w-8 drop-shadow-md" />
        </button>
        <button onClick={() => show("bottle")} aria-label="Una botella con un mensaje" className="absolute bottom-[40%] left-[6%] p-2 sm:hidden">
          <BottleSvg className="h-12 w-7 drop-shadow-md" />
        </button>

        {/* Sobre diminuto entre hojas */}
        <div className="absolute bottom-[-2%] right-[34%] sm:right-[30%]" style={layer(34)}>
          <LeafSvg className="pointer-events-none absolute -left-6 bottom-0 h-24 w-12 -rotate-[20deg]" />
          <LeafSvg className="pointer-events-none absolute left-4 bottom-0 h-20 w-10 rotate-[25deg]" />
          <button onClick={() => show("tiny")} aria-label="Un sobre diminuto escondido entre las hojas" className="relative bottom-6 p-2 transition hover:-translate-y-1">
            <EnvelopeSvg className="h-6 w-9" />
          </button>
        </div>
      </div>

      <Petals count={18} />

      <div className="relative z-20 flex justify-center pb-24">
        <button onClick={() => go("letter")} className="rounded-full border border-rose-antique/40 bg-ivory/80 px-6 py-3 font-serif text-lg italic text-ink backdrop-blur transition hover:-translate-y-0.5 hover:bg-ivory">
          Comenzar por la carta →
        </button>
      </div>

      {/* Tarjetas */}
      <Keepsake open={open === "lily"} onClose={() => setOpen(null)} label="Una pequeña dedicatoria">
        <img src={lilyPink} alt="" aria-hidden className="sticker animate-bloom mx-auto -mt-16 w-32" />
        <h2 className="mt-2 text-center font-serif text-2xl italic text-rose-deep">Una pequeña dedicatoria</h2>
        <p className="mt-4 text-center font-serif text-xl leading-relaxed text-ink">«Entre tantas flores, hay algunas que simplemente llaman nuestra atención. Tú siempre has tenido esa manera tan especial de hacer que las cosas más sencillas se vuelvan bonitas».</p>
      </Keepsake>
      <Keepsake open={open === "star"} onClose={() => setOpen(null)} label="Una pequeña promesa" variant="note">
        <StarSvg className="mx-auto h-14 w-14 drop-shadow-[0_0_18px_var(--gold)]" />
        <h2 className="mt-2 text-center font-serif text-2xl italic text-rose-deep">Una pequeña promesa</h2>
        <p className="mt-4 text-center font-serif text-xl leading-relaxed text-ink">«No quiero prometerte que nunca tendremos días difíciles. Quiero que, si algún día volvemos a caminar juntos, sepamos escucharnos, comprendernos y cuidar lo que estamos construyendo».</p>
      </Keepsake>
      <Keepsake open={open === "butterfly"} onClose={() => setOpen(null)} label="Los recuerdos" variant="polaroid">
        <div className="grid aspect-square place-items-center bg-blush/60">
          <ButterflySvg className="h-24 w-32" flutter={false} />
        </div>
        <p className="mt-4 px-2 text-center font-hand text-2xl leading-snug text-ink">«Hay recuerdos que no necesitan quedarse en el pasado para seguir siendo importantes. Algunos simplemente merecen conservarse con cariño».</p>
      </Keepsake>
      <Keepsake open={open === "bottle"} onClose={() => setOpen(null)} label="Un mensaje en una botella" variant="note">
        <BottleSvg className="mx-auto h-16 w-10" />
        <p className="mt-4 text-center font-hand text-2xl leading-snug text-ink">Si algún día te sientes lejos de todo, este pequeño mundo seguirá aquí, esperándote con calma.</p>
      </Keepsake>
      <Keepsake open={open === "tiny"} onClose={() => setOpen(null)} label="Un sobre diminuto" variant="note">
        <p className="text-center font-hand text-3xl text-rose-deep">psst…</p>
        <p className="mt-2 text-center font-serif text-xl italic leading-relaxed text-ink">«Yo estoy puesto pa' ti».</p>
      </Keepsake>
      <Keepsake open={open === "secret"} onClose={() => setOpen(null)} label="Una frase escondida">
        <img src={lilyBouquet} alt="" aria-hidden className="sticker animate-bloom mx-auto -mt-16 w-24" />
        <p className="mt-3 text-center font-hand text-3xl leading-snug text-rose-deep">{HIDDEN_PHRASES[(Math.floor(flowerTaps / 3) - 1) % HIDDEN_PHRASES.length]}</p>
      </Keepsake>
    </section>
  );
}
