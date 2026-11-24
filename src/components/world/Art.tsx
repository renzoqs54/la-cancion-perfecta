import type { SVGProps } from "react";

export function PetalSvg(props: SVGProps<SVGSVGElement> & { tone?: "pink" | "white" | "deep" }) {
  const { tone = "pink", ...rest } = props;
  const fill = tone === "white" ? "var(--ivory)" : tone === "deep" ? "var(--rose-antique)" : "var(--blush)";
  return (
    <svg viewBox="0 0 20 28" aria-hidden {...rest}>
      <path d="M10 1C15 6 19 13 16 21c-2 5-10 7-12 1C1 14 5 6 10 1z" fill={fill} stroke="var(--rose-antique)" strokeOpacity=".35" strokeWidth=".6" />
      <path d="M10 4c0 6-1 13-3 19" stroke="var(--rose-antique)" strokeOpacity=".35" strokeWidth=".5" fill="none" />
    </svg>
  );
}

export function ButterflySvg({ flutter = true, ...props }: SVGProps<SVGSVGElement> & { flutter?: boolean }) {
  return (
    <svg viewBox="0 0 64 48" aria-hidden {...props}>
      <g style={flutter ? { animation: "flutter .35s ease-in-out infinite", transformOrigin: "32px 24px" } : undefined}>
        <path d="M31 22C24 6 6 2 4 10s8 14 27 14z" fill="var(--blush)" stroke="var(--rose-deep)" strokeWidth="1.2" />
        <path d="M31 25C20 26 10 34 14 42s14-4 17-17z" fill="var(--rose-antique)" stroke="var(--rose-deep)" strokeWidth="1.2" />
        <path d="M33 22C40 6 58 2 60 10s-8 14-27 14z" fill="var(--blush)" stroke="var(--rose-deep)" strokeWidth="1.2" />
        <path d="M33 25C44 26 54 34 50 42s-14-4-17-17z" fill="var(--rose-antique)" stroke="var(--rose-deep)" strokeWidth="1.2" />
        <circle cx="14" cy="11" r="2.4" fill="var(--ivory)" />
        <circle cx="50" cy="11" r="2.4" fill="var(--ivory)" />
      </g>
      <rect x="30.5" y="14" width="3" height="20" rx="1.5" fill="var(--ink)" />
      <path d="M31 14c-2-5-5-7-7-8M33 14c2-5 5-7 7-8" stroke="var(--ink)" strokeWidth="1" fill="none" />
    </svg>
  );
}

export function StarSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden {...props}>
      <path d="M24 3l5.6 13.2L44 17.6l-10.9 9.6 3.3 14.3L24 34l-12.4 7.5 3.3-14.3L4 17.6l14.4-1.4z" fill="var(--gold)" stroke="oklch(0.65 0.09 75)" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M24 10l2.8 7" stroke="var(--ivory)" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

export function NoteSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden {...props}>
      <path d="M24 46V14l28-6v32" fill="none" stroke="var(--rose-deep)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 20l28-6" stroke="var(--rose-deep)" strokeWidth="4" />
      <ellipse cx="17" cy="47" rx="8" ry="6" fill="var(--rose-deep)" transform="rotate(-18 17 47)" />
      <ellipse cx="45" cy="41" rx="8" ry="6" fill="var(--rose-deep)" transform="rotate(-18 45 41)" />
    </svg>
  );
}

export function EnvelopeSvg({ open = false, ...props }: SVGProps<SVGSVGElement> & { open?: boolean }) {
  return (
    <svg viewBox="0 0 120 84" aria-hidden {...props}>
      <rect x="2" y="10" width="116" height="72" rx="6" fill="var(--card)" stroke="var(--rose-antique)" strokeWidth="1.5" />
      <path d="M4 80l46-34M116 80L70 46" stroke="var(--rose-antique)" strokeWidth="1.2" fill="none" opacity=".6" />
      <path d={open ? "M2 12L60 -24L118 12" : "M2 12l58 40 58-40"} fill="var(--blush)" stroke="var(--rose-antique)" strokeWidth="1.5" strokeLinejoin="round" style={{ transition: "d .6s" }} />
      <circle cx="60" cy="50" r="9" fill="var(--rose-deep)" />
      <path d="M60 55l-5-5a3 3 0 015-3.5 3 3 0 015 3.5z" fill="var(--blush)" />
    </svg>
  );
}

export function BottleSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 70" aria-hidden {...props}>
      <rect x="15" y="2" width="10" height="9" rx="2" fill="oklch(0.6 0.06 60)" />
      <path d="M14 11h12v8c8 4 10 10 10 18v24c0 4-3 7-7 7H11c-4 0-7-3-7-7V37c0-8 2-14 10-18z" fill="oklch(0.9 0.04 180 / .55)" stroke="var(--botanic)" strokeWidth="1.4" />
      <rect x="11" y="34" width="18" height="20" rx="2" fill="var(--ivory)" transform="rotate(-8 20 44)" />
      <path d="M14 40h11M14 44h9M14 48h11" stroke="var(--rose-antique)" strokeWidth="1" transform="rotate(-8 20 44)" />
    </svg>
  );
}

export function LeafSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 120" aria-hidden {...props}>
      <path d="M30 118C8 90 4 40 30 2c26 38 22 88 0 116z" fill="var(--sage)" stroke="var(--botanic)" strokeWidth="1.5" />
      <path d="M30 116V10" stroke="var(--botanic)" strokeWidth="1.2" />
    </svg>
  );
}

export function WaxSeal({ broken = false }: { broken?: boolean }) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden className="h-full w-full">
      <g style={{ transition: "transform .7s cubic-bezier(.2,.8,.2,1), opacity .7s", transform: broken ? "translate(-10px, 14px) rotate(-25deg)" : "none", opacity: broken ? 0 : 1, transformOrigin: "30px 30px" }}>
        <path d="M30 2c6 0 9 4 14 5s8 6 9 11 5 8 4 13-4 8-5 13-6 8-11 9-8 5-13 4-8-4-13-5-8-6-9-11-5-8-4-13 4-8 5-13 6-8 11-9 6-4 12-4z" fill="var(--rose-deep)" clipPath="inset(0 50% 0 0)" />
      </g>
      <g style={{ transition: "transform .7s cubic-bezier(.2,.8,.2,1), opacity .7s", transform: broken ? "translate(12px, 16px) rotate(30deg)" : "none", opacity: broken ? 0 : 1, transformOrigin: "30px 30px" }}>
        <path d="M30 2c6 0 9 4 14 5s8 6 9 11 5 8 4 13-4 8-5 13-6 8-11 9-8 5-13 4-8-4-13-5-8-6-9-11-5-8-4-13 4-8 5-13 6-8 11-9 6-4 12-4z" fill="var(--rose-deep)" clipPath="inset(0 0 0 50%)" />
      </g>
      {!broken && (
        <>
          <circle cx="30" cy="30" r="17" fill="none" stroke="oklch(0.5 0.1 357)" strokeWidth="1.5" />
          <path d="M30 40l-9-9a5.5 5.5 0 019-6.5 5.5 5.5 0 019 6.5z" fill="oklch(0.5 0.1 357)" />
        </>
      )}
    </svg>
  );
}
