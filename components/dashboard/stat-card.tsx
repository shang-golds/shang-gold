"use client";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

export function StatCard({ label, value, icon, highlight = false }: StatCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border p-4 transition-all ${
        highlight
          ? "border-gold-400/30 bg-gradient-to-br from-gold-400/10 via-card to-card"
          : "border-border bg-card hover:border-gold-400/20"
      }`}
    >
      {/* Subtle corner glow for highlighted cards */}
      {highlight && (
        <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold-400/10 blur-2xl" />
      )}
      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span
            className={`text-xl font-bold ${
              highlight ? "text-gold-400" : "text-foreground"
            }`}
          >
            {value}
          </span>
        </div>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            highlight
              ? "bg-gold-400/15 text-gold-400"
              : "bg-secondary text-muted-foreground group-hover:text-gold-400"
          } transition-colors`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
