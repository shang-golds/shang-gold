"use client";

import { GoldLogo } from "./gold-logo";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="pulse-gold rounded-full">
          <GoldLogo size={80} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="gold-shimmer font-serif text-xl tracking-widest">
            SHANG GOLD
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400 delay-150" style={{ animationDelay: "0.15s" }} />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400 delay-300" style={{ animationDelay: "0.3s" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
