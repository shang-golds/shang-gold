"use client";

interface ProfileSectionProps {
  fullName: string;
  investorNumber: number;
}

export function ProfileSection({ fullName, investorNumber }: ProfileSectionProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold-400/30 bg-gradient-to-br from-gold-400/20 to-transparent">
          <span className="font-serif text-2xl font-bold text-gold-400">
            {fullName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-lg font-semibold text-foreground">{fullName}</h3>
          <span className="text-xs text-muted-foreground">Gold Investor</span>
        </div>
      </div>

      {/* Info rows */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="text-sm text-muted-foreground">Full Name</span>
          <span className="text-sm font-medium text-foreground">{fullName}</span>
        </div>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="text-sm text-muted-foreground">Investor Number</span>
          <span className="font-mono text-sm font-medium text-gold-400">
            #{investorNumber}
          </span>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-muted-foreground">Account Status</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
