"use client";

import { GoldLogo } from "./gold-logo";

interface LoginFormProps {
  investorNumber: string;
  pin: string;
  error: string;
  onInvestorNumberChange: (value: string) => void;
  onPinChange: (value: string) => void;
  onLogin: () => void;
}

export function LoginForm({
  investorNumber,
  pin,
  error,
  onInvestorNumberChange,
  onPinChange,
  onLogin,
}: LoginFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {/* Subtle radial glow behind the card */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-gold-400/5">
          {/* Gold accent top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-gold-700 via-gold-400 to-gold-700" />

          <div className="flex flex-col items-center gap-6 p-8">
            {/* Logo */}
            <div className="pulse-gold rounded-full">
              <GoldLogo size={80} />
            </div>

            <div className="flex flex-col items-center gap-1">
              <h1 className="gold-shimmer font-serif text-2xl tracking-[0.2em]">
                SHANG GOLD
              </h1>
              <p className="text-sm text-muted-foreground">
                Gold-Linked Investment Dashboard
              </p>
            </div>

            {/* Divider */}
            <div className="flex w-full items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Sign In
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Form */}
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="investor-number" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Investor Number
                </label>
                <input
                  id="investor-number"
                  className="rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-colors"
                  placeholder="Enter your investor number"
                  value={investorNumber}
                  onChange={(e) => onInvestorNumberChange(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="pin" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  PIN
                </label>
                <input
                  id="pin"
                  className="rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-colors"
                  type="password"
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={(e) => onPinChange(e.target.value)}
                />
              </div>

              <button
                className="mt-2 w-full rounded-lg bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 px-4 py-3 font-semibold text-background transition-all hover:from-gold-500 hover:via-gold-300 hover:to-gold-500 hover:shadow-lg hover:shadow-gold-400/20 active:scale-[0.98]"
                onClick={onLogin}
              >
                Access Dashboard
              </button>

              {error && (
                <p className="text-center text-sm text-destructive">{error}</p>
              )}
            </div>

            {/* Footer */}
            <p className="text-xs text-muted-foreground">
              Secure investor portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
