import { JOURNEY, useWorld } from "./world";

export function WorldNav({ dark = false }: { dark?: boolean }) {
  const { scene, go, visited, soundOn, toggleSound, playing, audioRef } = useWorld();
  if (scene === "intro") return null;
  const tone = dark ? "text-ivory/85 border-ivory/25 bg-night/40" : "text-ink/80 border-rose-antique/30 bg-ivory/70";
  return (
    <>
      {scene !== "garden" && (
        <button
          onClick={() => go("garden")}
          className={`fixed left-4 top-4 z-40 flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-sm backdrop-blur-md transition hover:-translate-y-0.5 ${tone}`}
        >
          <span aria-hidden>❀</span> Volver al jardín
        </button>
      )}
      <div className="fixed right-4 top-4 z-40 flex items-center gap-2">
        {playing && scene !== "song" && (
          <button
            onClick={() => audioRef.current?.pause()}
            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs backdrop-blur-md ${tone}`}
            aria-label="Pausar la canción"
          >
            <span className="flex h-3 items-end gap-0.5" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-0.5 bg-rose-deep" style={{ height: "100%", animation: `twinkle ${0.6 + i * 0.2}s ease-in-out infinite` }} />
              ))}
            </span>
            Sonando
          </button>
        )}
        <button
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? "Desactivar sonidos" : "Activar sonidos"}
          className={`grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition hover:scale-105 ${tone}`}
        >
          {soundOn ? "♪" : <span className="opacity-60">♪̸</span>}
        </button>
      </div>
      <nav aria-label="Recorrido" className={`fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-md ${tone}`}>
        {JOURNEY.filter((j) => j.id !== "intro").map((j) => {
          const active = j.id === scene;
          return (
            <button
              key={j.id}
              onClick={() => go(j.id)}
              aria-current={active ? "step" : undefined}
              className={`group relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs transition sm:px-3 ${active ? "bg-rose-deep text-primary-foreground" : "hover:bg-blush/60"}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-ivory" : visited.has(j.id) ? "bg-rose-deep" : "bg-rose-antique/40"}`} aria-hidden />
              <span className={active ? "" : "hidden sm:inline"}>{j.label}</span>
              {!active && <span className="sr-only sm:hidden">{j.label}</span>}
            </button>
          );
        })}
      </nav>
    </>
  );
}
