import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import songAsset from "@/assets/sigo-extranandote.mp3.asset.json";
import { setSfxEnabled, sfx } from "./sfx";

export type Scene = "intro" | "garden" | "letter" | "song" | "album" | "final";
export type AlbumPhoto = { src: string; name: string };
export const JOURNEY: { id: Scene; label: string }[] = [
  { id: "intro", label: "Portada" },
  { id: "garden", label: "Jardín" },
  { id: "letter", label: "Carta" },
  { id: "song", label: "Canción" },
  { id: "album", label: "Álbum" },
  { id: "final", label: "Jardín final" },
];

type World = {
  scene: Scene;
  go: (s: Scene) => void;
  visited: Set<Scene>;
  soundOn: boolean;
  toggleSound: () => void;
  audioRef: RefObject<HTMLAudioElement | null>;
  playing: boolean;
  albumPhotos: (AlbumPhoto | null)[];
  setAlbumPhoto: (index: number, photo: AlbumPhoto | null) => void;
};

const Ctx = createContext<World | null>(null);

export function WorldProvider({ children }: { children: ReactNode }) {
  const [scene, setScene] = useState<Scene>("intro");
  const [visited, setVisited] = useState<Set<Scene>>(() => new Set(["intro"]));
  const [soundOn, setSoundOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [albumPhotos, setAlbumPhotos] = useState<(AlbumPhoto | null)[]>([null, null, null]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const go = useCallback((s: Scene) => {
    sfx.paper();
    setScene(s);
    setVisited((v) => new Set(v).add(s));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn((v) => {
      setSfxEnabled(!v);
      if (!v) setTimeout(() => sfx.chime(), 30);
      return !v;
    });
  }, []);

  const setAlbumPhoto = useCallback((index: number, photo: AlbumPhoto | null) => {
    setAlbumPhotos((current) => current.map((item, itemIndex) => (itemIndex === index ? photo : item)));
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    a.addEventListener("play", on);
    a.addEventListener("pause", off);
    a.addEventListener("ended", off);
    return () => {
      a.removeEventListener("play", on);
      a.removeEventListener("pause", off);
      a.removeEventListener("ended", off);
    };
  }, []);

  const value = useMemo(
    () => ({ scene, go, visited, soundOn, toggleSound, audioRef, playing, albumPhotos, setAlbumPhoto }),
    [scene, go, visited, soundOn, toggleSound, audioRef, playing, albumPhotos, setAlbumPhoto],
  );
  return (
    <Ctx.Provider value={value}>
      {children}
      <audio ref={audioRef} src={songAsset.url} preload="metadata" />
    </Ctx.Provider>
  );
}

export function useWorld() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWorld fuera de WorldProvider");
  return v;
}
