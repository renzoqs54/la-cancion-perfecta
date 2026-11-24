import { useEffect, useState } from "react";
import { ButterflySvg, PetalSvg } from "./Art";

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function Petals({ count = 14, intensity = 1 }: { count?: number; intensity?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const tones = ["pink", "white", "deep", "pink"] as const;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const r = rand(i + 1);
        const size = 10 + r * 16;
        return (
          <PetalSvg
            key={i}
            tone={tones[i % 4]}
            className="absolute top-0"
            style={{
              left: `${rand(i + 7) * 100}%`,
              width: size,
              height: size * 1.4,
              opacity: 0.85,
              ["--drift" as string]: `${(rand(i + 3) - 0.5) * 160}px`,
              animation: `petal-fall ${(14 + rand(i + 11) * 12) / intensity}s linear ${-rand(i + 5) * 20}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

export function Fireflies({ count = 16, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-gold"
          style={{
            left: `${rand(i + 21) * 100}%`,
            top: `${30 + rand(i + 31) * 65}%`,
            boxShadow: "var(--glow-gold)",
            animation: `firefly ${6 + rand(i + 41) * 6}s ease-in-out ${-rand(i) * 8}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function Sparkles({ count = 10, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute text-gold"
          style={{
            left: `${rand(i + 51) * 100}%`,
            top: `${rand(i + 61) * 55}%`,
            fontSize: 8 + rand(i + 71) * 10,
            animation: `twinkle ${2 + rand(i + 81) * 3}s ease-in-out ${-rand(i + 2) * 3}s infinite`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}

export function DriftingButterfly({ delay = 0, duration = 38, top = 0 }: { delay?: number; duration?: number; top?: number }) {
  return (
    <div className="pointer-events-none absolute left-0 w-10" style={{ top: `${top}%`, animation: `butterfly-path ${duration}s linear ${delay}s infinite` }} aria-hidden>
      <ButterflySvg className="w-10 sticker" />
    </div>
  );
}
