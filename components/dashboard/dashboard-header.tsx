"use client";

import { GoldLogo } from "./gold-logo";

interface DashboardHeaderProps {
  investorName: string;
}

export function DashboardHeader({ investorName }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <GoldLogo size={40} />
          <div>
            <h1 className="gold-shimmer font-serif text-lg tracking-[0.15em]">
              SHANG GOLD
            </h1>
            <p className="text-xs text-muted-foreground">Investment Dashboard</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground">Welcome back,</span>
          <span className="text-sm font-medium text-foreground">
            {investorName}
          </span>
        </div>
      </div>
    </header>
  );
}
