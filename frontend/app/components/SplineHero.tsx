"use client";

type SplineHeroProps = {
  src: string;
};

export function SplineHero({ src }: SplineHeroProps) {
  return (
    <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
      <iframe
        src={src}
        className="w-full h-full"
        frameBorder="0"
        title="3D Hero"
        allow="autoplay; fullscreen"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />
    </div>
  );
}
