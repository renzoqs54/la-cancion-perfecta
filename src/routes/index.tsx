import { createFileRoute } from "@tanstack/react-router";
import { WorldProvider, useWorld } from "@/components/world/world";
import { Intro } from "@/components/world/Intro";
import { Garden } from "@/components/world/Garden";
import { WorldNav } from "@/components/world/Nav";

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
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap" },
    ],
  }),
  component: Index,
});

function Scenes() {
  const { scene } = useWorld();
  return (
    <main className="flower-cursor">
      {scene === "intro" ? <Intro /> : <Garden />}
      <WorldNav />
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
