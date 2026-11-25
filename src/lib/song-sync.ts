import type { LyricLine } from "@/data/lyrics";

export type LyricPosition = { lineIndex: number; wordIndex: number };

export function locateLyricAtTime(lines: LyricLine[], time: number): LyricPosition | null {
  if (!Number.isFinite(time) || time < 0) return null;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    if (!line || time < line.start || time >= line.end) continue;
    const wordIndex = line.words.findIndex((word) => time >= word.start && time < word.end);
    if (wordIndex >= 0) return { lineIndex, wordIndex };
  }

  return null;
}

export function formatAudioTime(seconds: number): string {
  const safeSeconds = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}