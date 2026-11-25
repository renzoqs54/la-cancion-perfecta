import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { AudioLines, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import cover from "@/assets/cover.webp";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { LYRICS } from "@/data/lyrics";
import { formatAudioTime, locateLyricAtTime } from "@/lib/song-sync";
import { Fireflies, Petals, Sparkles } from "./Ambient";
import { useWorld } from "./world";

export function SongScene() {
  const { audioRef, playing } = useWorld();
  const reducedMotion = useReducedMotion();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const lineRefs = useRef(new Map<number, HTMLParagraphElement>());
  const lyricsViewportRef = useRef<HTMLDivElement>(null);
  const position = locateLyricAtTime(LYRICS, currentTime);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const sync = () => {
      setCurrentTime(audio.currentTime);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setVolume(audio.volume);
      setMuted(audio.muted);
    };
    const onError = () => setPlaybackError(true);
    audio.addEventListener("timeupdate", sync);
    audio.addEventListener("loadedmetadata", sync);
    audio.addEventListener("durationchange", sync);
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    audio.addEventListener("ended", sync);
    audio.addEventListener("seeking", sync);
    audio.addEventListener("volumechange", sync);
    audio.addEventListener("error", onError);
    sync();
    return () => {
      audio.removeEventListener("timeupdate", sync);
      audio.removeEventListener("loadedmetadata", sync);
      audio.removeEventListener("durationchange", sync);
      audio.removeEventListener("play", sync);
      audio.removeEventListener("pause", sync);
      audio.removeEventListener("ended", sync);
      audio.removeEventListener("seeking", sync);
      audio.removeEventListener("volumechange", sync);
      audio.removeEventListener("error", onError);
    };
  }, [audioRef]);

  useEffect(() => {
    if (position === null) return;
    const line = lineRefs.current.get(position.lineIndex);
    if (line && lyricsViewportRef.current) {
      line.scrollIntoView({ block: "center", behavior: reducedMotion ? "instant" : "smooth" });
    }
  }, [position?.lineIndex, reducedMotion]);

  function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      setPlaybackError(false);
      void audio.play().catch(() => setPlaybackError(true));
    } else {
      audio.pause();
    }
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.muted || audio.volume === 0) {
      if (audio.volume === 0) audio.volume = 0.65;
      audio.muted = false;
    } else {
      audio.muted = true;
    }
    setMuted(audio.muted);
    setVolume(audio.volume);
  }

  function seekTo(time: number) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(time) || duration <= 0) return;
    audio.currentTime = Math.min(Math.max(time, 0), duration);
    setCurrentTime(audio.currentTime);
  }

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[image:var(--gradient-night)] px-4 pb-32 pt-20 text-ivory sm:px-8 sm:pt-24">
      <Sparkles count={18} />
      <Fireflies count={14} className="opacity-75" />
      {playing && !reducedMotion && <Petals count={10} intensity={0.8} />}
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mx-auto mb-9 max-w-2xl text-center">
          <p className="font-hand text-2xl text-gold">Un recuerdo hecho canción</p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Una canción para ti</h1>
          <p className="mt-3 font-serif text-xl italic text-ivory/75">Hay canciones que parecen encontrar las palabras que a veces nosotros no sabemos decir.</p>
        </header>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(18rem,0.82fr)_minmax(0,1.18fr)] lg:gap-14">
          <div className="mx-auto w-full max-w-md">
            <motion.figure
              animate={playing && !reducedMotion ? { scale: [1, 1.018, 1] } : { scale: 1 }}
              transition={{ duration: 5, repeat: playing && !reducedMotion ? Infinity : 0, ease: "easeInOut" }}
              className="relative mx-auto aspect-square w-full overflow-hidden border border-ivory/35 p-2 shadow-2xl"
            >
              <img src={cover} alt="Portada de lirios rosados y blancos en acuarela" className="h-full w-full object-cover" />
              <figcaption className="absolute inset-x-2 bottom-2 flex items-end justify-between bg-gradient-to-t from-night/90 via-night/30 to-transparent px-5 pb-4 pt-12">
                <div>
                  <p className="font-serif text-3xl text-ivory">Sigo extrañándote</p>
                  <p className="mt-1 font-sans text-sm text-ivory/75">J. Balvin</p>
                </div>
                <div className="flex h-8 items-end gap-1" aria-hidden>
                  {[0, 1, 2, 3, 4].map((bar) => (
                    <span key={bar} className={`w-1.5 rounded-full bg-gold transition-all ${playing ? "h-7 animate-pulse" : "h-2 opacity-65"}`} />
                  ))}
                </div>
              </figcaption>
            </motion.figure>

            <div className="mt-7 border-y border-ivory/20 py-5">
              <div className="mb-3 flex items-center justify-between gap-4 font-sans text-xs tabular-nums text-ivory/75">
                <span>{formatAudioTime(currentTime)}</span>
                <span>{formatAudioTime(duration)}</span>
              </div>
              <Slider
                aria-label="Progreso de la canción"
                value={[Math.min(currentTime, duration || 1)]}
                min={0}
                max={Math.max(duration, 1)}
                step={0.1}
                onValueChange={(values) => {
                  const next = values[0];
                  if (next !== undefined) seekTo(next);
                }}
                className="[&_[data-orientation=horizontal]>span]:bg-gold [&>span:first-child]:bg-ivory/25 [&>span:last-child]:border-gold [&>span:last-child]:bg-ivory"
              />
              <div className="mt-5 flex items-center justify-center gap-3">
                <Button variant="ghost" size="icon" aria-label="Reiniciar canción" onClick={() => seekTo(0)} className="text-ivory hover:bg-ivory/10 hover:text-ivory">
                  <RotateCcw aria-hidden />
                </Button>
                <Button onClick={togglePlayback} size="icon" aria-label={playing ? "Pausar canción" : "Reproducir canción"} className="h-14 w-14 rounded-full bg-gold text-night hover:bg-gold/90">
                  {playing ? <Pause aria-hidden className="size-6" /> : <Play aria-hidden className="size-6" />}
                </Button>
                <Button variant="ghost" size="icon" aria-label={muted ? "Activar volumen" : "Silenciar canción"} onClick={toggleMute} className="text-ivory hover:bg-ivory/10 hover:text-ivory">
                  {muted || volume === 0 ? <VolumeX aria-hidden /> : <Volume2 aria-hidden />}
                </Button>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Volume2 aria-hidden className="size-4 shrink-0 text-ivory/70" />
                <Slider
                  aria-label="Volumen"
                  value={[muted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(values) => {
                    const next = values[0];
                    const audio = audioRef.current;
                    if (next === undefined || !audio) return;
                    audio.volume = next;
                    audio.muted = next === 0;
                    setVolume(next);
                    setMuted(next === 0);
                  }}
                  className="[&_[data-orientation=horizontal]>span]:bg-gold [&>span:first-child]:bg-ivory/25 [&>span:last-child]:border-gold [&>span:last-child]:bg-ivory"
                />
                <AudioLines aria-hidden className={`size-4 shrink-0 text-gold ${playing && !reducedMotion ? "animate-pulse" : "opacity-60"}`} />
              </div>
            </div>
            {playbackError && <p role="alert" className="mt-3 text-center font-sans text-sm text-ivory/80">No se pudo abrir la canción. Inténtalo de nuevo.</p>}
            <p className="mt-4 text-center font-hand text-xl text-gold/90">«Sigo extrañándote»</p>
          </div>

          <section aria-label="Letra sincronizada" className="border-t border-ivory/20 pt-5 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-serif text-2xl">La letra</h2>
              <span className="font-sans text-xs text-ivory/55">Sigue la música</span>
            </div>
            <div ref={lyricsViewportRef} className="h-[48vh] min-h-72 overflow-y-auto scroll-smooth pr-3 sm:h-[54vh]" aria-live="off">
              <div className="space-y-8 py-[22vh]">
                {LYRICS.map((line, lineIndex) => (
                  <p
                    key={`${line.start}-${lineIndex}`}
                    ref={(element) => {
                      if (element) lineRefs.current.set(lineIndex, element);
                      else lineRefs.current.delete(lineIndex);
                    }}
                    className={`font-serif text-xl leading-relaxed transition-opacity sm:text-2xl ${position?.lineIndex === lineIndex ? "opacity-100" : "opacity-55"}`}
                  >
                    {line.words.map((word, wordIndex) => {
                      const active = position?.lineIndex === lineIndex && position.wordIndex === wordIndex;
                      const past = position !== null && (lineIndex < position.lineIndex || (lineIndex === position.lineIndex && wordIndex < position.wordIndex));
                      return (
                        <Button
                          key={`${word.start}-${wordIndex}`}
                          type="button"
                          variant="ghost"
                          size="sm"
                          aria-label={`Escuchar desde «${word.word}»`}
                          onClick={() => seekTo(word.start)}
                          className={`h-auto min-h-8 whitespace-nowrap px-1 py-0 align-baseline font-serif text-xl leading-relaxed transition-colors sm:text-2xl ${active ? "bg-gold/20 text-gold hover:bg-gold/20 hover:text-gold" : past ? "text-ivory/60 hover:bg-ivory/10 hover:text-ivory" : "text-ivory/90 hover:bg-ivory/10 hover:text-ivory"}`}
                        >
                          {word.word}
                        </Button>
                      );
                    })}
                  </p>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}