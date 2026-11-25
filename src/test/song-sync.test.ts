import { describe, expect, it } from "vitest";
import { LYRICS } from "@/data/lyrics";
import { formatAudioTime, locateLyricAtTime } from "@/lib/song-sync";

describe("song synchronization", () => {
  it("selects the word whose interval contains the audio currentTime", () => {
    expect(locateLyricAtTime(LYRICS, 12.1)).toEqual({ lineIndex: 0, wordIndex: 0 });
    expect(locateLyricAtTime(LYRICS, 12.66)).toEqual({ lineIndex: 0, wordIndex: 1 });
  });

  it("returns no active lyric outside the supplied word intervals", () => {
    expect(locateLyricAtTime(LYRICS, 5)).toBeNull();
    expect(locateLyricAtTime(LYRICS, Number.NaN)).toBeNull();
  });

  it("formats the real audio time as minutes and seconds", () => {
    expect(formatAudioTime(200.57)).toBe("3:20");
    expect(formatAudioTime(Number.NaN)).toBe("0:00");
  });
});