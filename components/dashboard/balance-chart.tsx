"use client";

interface BalanceChartProps {
  deposits: number;
  profit: number;
  withdrawn: number;
  total: number;
}

export function BalanceChart({ deposits, profit, withdrawn, total }: BalanceChartProps) {
  const segments = [
    { label: "Deposits", value: deposits, color: "#d4af37" },
    { label: "Profit", value: profit, color: "#f5e6b8" },
    { label: "Withdrawn", value: withdrawn, color: "#645207" },
  ];

  const maxVal = Math.max(total, 1);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Gold Balance Breakdown
        </h3>
        <span className="text-xs text-muted-foreground">(grams)</span>
      </div>

      {/* Bar chart */}
      <div className="flex flex-col gap-3">
        {segments.map((seg) => {
          const pct = total > 0 ? (seg.value / maxVal) * 100 : 0;
          return (
            <div key={seg.label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{seg.label}</span>
                <span className="font-medium text-foreground">
                  {seg.value.toFixed(2)} g
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(pct, 0)}%`,
                    backgroundColor: seg.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Net Total
        </span>
        <span className="text-lg font-bold text-gold-400">
          {total.toFixed(2)} g
        </span>
      </div>
    </div>
  );
}
