"use client";

type Transaction = {
  tx_date: string;
  type: string;
  grams: number | null;
  usd: number | null;
};

interface TransactionsTableProps {
  transactions: Transaction[];
  loading: boolean;
}

function getTypeBadgeClass(type: string) {
  const t = type.toLowerCase();
  if (t.includes("deposit") || t.includes("buy")) {
    return "bg-gold-400/15 text-gold-400 border-gold-400/30";
  }
  if (t.includes("profit") || t.includes("earn")) {
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  }
  if (t.includes("withdraw") || t.includes("sell")) {
    return "bg-red-500/15 text-red-400 border-red-500/30";
  }
  return "bg-secondary text-muted-foreground border-border";
}

export function TransactionsTable({ transactions, loading }: TransactionsTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-lg bg-secondary"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <p className="text-sm">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 px-1">
      {/* Table Header */}
      <div className="grid grid-cols-4 gap-3 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Date</span>
        <span>Type</span>
        <span className="text-right">Gold (g)</span>
        <span className="text-right">USD</span>
      </div>

      {/* Transaction rows */}
      {transactions.map((tx, i) => (
        <div
          key={i}
          className="grid grid-cols-4 gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-gold-400/20 hover:bg-secondary/50"
        >
          <span className="text-sm text-foreground">{tx.tx_date}</span>
          <span>
            <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium ${getTypeBadgeClass(tx.type)}`}>
              {tx.type}
            </span>
          </span>
          <span className="text-right text-sm font-medium text-foreground">
            {tx.grams != null ? `${tx.grams}` : "-"}
          </span>
          <span className="text-right text-sm font-medium text-gold-400">
            {tx.usd != null ? `$${tx.usd}` : "-"}
          </span>
        </div>
      ))}
    </div>
  );
}
