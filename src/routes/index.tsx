import { createFileRoute } from "@tanstack/react-router";
import { WorldProvider, useWorld } from "@/components/world/world";
import { Intro } from "@/components/world/Intro";
import { Garden } from "@/components/world/Garden";
import { WorldNav } from "@/components/world/Nav";
import { LetterScene } from "@/components/world/LetterScene";
import { SongScene } from "@/components/world/SongScene";
import { AlbumScene } from "@/components/world/AlbumScene";
import { FinalScene } from "@/components/world/FinalScene";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Un mundo solo para nosotros ♡" },
      { name: "description", content: "Un pequeño universo de lirios, recuerdos y canciones, hecho por Renzo para Pilar." },
      { property: "og:title", content: "Un mundo solo para nosotros ♡" },
      { property: "og:description", content: "Un pequeño universo de lirios, recuerdos y canciones, hecho por Renzo para Pilar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
  {
    rel: "icon",
    type: "image/png",
    href: "/favicon.png",
  },
  {
    rel: "apple-touch-icon",
    href: "/favicon.png",
  },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap",
  },
],
  }),
  component: Index,
});

function Scenes() {
  const { scene } = useWorld();
  const reducedMotion = useReducedMotion();
  const content = scene === "intro" ? <Intro />
    : scene === "garden" ? <Garden />
      : scene === "letter" ? <LetterScene />
        : scene === "song" ? <SongScene />
          : scene === "album" ? <AlbumScene />
            : <FinalScene />;
  return (
    <main className="flower-cursor">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={scene}
          className="min-h-dvh"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
          transition={{ duration: reducedMotion ? 0 : 0.42, ease: "easeOut" }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
      <WorldNav dark={scene === "song" || scene === "final"} />
    </main>
  );
}

function Index() {
  return (
    <WorldProvider>
      <Scenes />
    </WorldProvider>
  );
}
