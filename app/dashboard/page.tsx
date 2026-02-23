"use client";

import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/dashboard/loading-screen";
import { LoginForm } from "@/components/dashboard/login-form";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { BalanceChart } from "@/components/dashboard/balance-chart";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { ProfileSection } from "@/components/dashboard/profile-section";
import { BottomNav } from "@/components/dashboard/bottom-nav";

type Investor = {
  full_name: string;
  investor_number: number;
};

type Balance = {
  deposit_grams: number;
  profit_grams: number;
  withdrawn_grams: number;
  total_grams: number;
  gold_price_18k_usd: number | null;
  total_usd: number | null;
};

type Transaction = {
  tx_date: string;
  type: string;
  grams: number | null;
  usd: number | null;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);

  const [investorNumber, setInvestorNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // Bottom navigation tabs
  const [tab, setTab] = useState<
    "account" | "transactions" | "profile"
  >("account");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);

  // Load dashboard
  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setInvestor(data.investor);
        setBalance(data.balance);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loadTransactions = () => {
    setTxLoading(true);
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions || []);
        setTxLoading(false);
      })
      .catch(() => setTxLoading(false));
  };

  const login = async () => {
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        investor_number: investorNumber,
        pin,
      }),
    });

    const data = await res.json();
    if (data.success) window.location.reload();
    else setError("Invalid investor number or PIN");
  };

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Login screen
  if (!investor) {
    return (
      <LoginForm
        investorNumber={investorNumber}
        pin={pin}
        error={error}
        onInvestorNumberChange={setInvestorNumber}
        onPinChange={setPin}
        onLogin={login}
      />
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.04)_0%,_transparent_60%)]" />

      <DashboardHeader investorName={investor.full_name} />

      <div className="relative mx-auto max-w-2xl px-4 py-6">
        {/* ACCOUNT TAB */}
        {tab === "account" && (
          <div className="flex flex-col gap-5">
            {/* Investor Info Card */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Investor Details
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-muted-foreground">Investor</span>
                <span className="font-medium text-foreground">{investor.full_name}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 px-5 py-3 text-sm">
                <span className="text-muted-foreground">Investor #</span>
                <span className="font-mono font-medium text-gold-400">
                  {investor.investor_number}
                </span>
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Deposits"
                value={`${balance?.deposit_grams ?? 0} g`}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                }
              />
              <StatCard
                label="Profit"
                value={`${balance?.profit_grams ?? 0} g`}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                }
              />
              <StatCard
                label="Withdrawn"
                value={`${balance?.withdrawn_grams ?? 0} g`}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                }
              />
              <StatCard
                label="Total Gold"
                value={`${balance?.total_grams ?? 0} g`}
                highlight
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                }
              />
            </div>

            {/* Balance Chart */}
            <BalanceChart
              deposits={balance?.deposit_grams ?? 0}
              profit={balance?.profit_grams ?? 0}
              withdrawn={balance?.withdrawn_grams ?? 0}
              total={balance?.total_grams ?? 0}
            />

            {/* Valuation Card */}
            <div className="overflow-hidden rounded-xl border border-gold-400/20 bg-gradient-to-br from-gold-400/5 via-card to-card">
              <div className="px-5 py-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Current Valuation
                </h2>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 px-5 py-3 text-sm">
                <span className="text-muted-foreground">Gold Price (18K)</span>
                <span className="font-medium text-foreground">
                  {balance?.gold_price_18k_usd
                    ? `$${balance.gold_price_18k_usd.toFixed(2)} / g`
                    : "-"}
                </span>
              </div>
              <div className="border-t border-border/50 bg-gold-400/5 px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Total Value
                  </span>
                  <span className="text-2xl font-bold text-gold-400">
                    {balance?.total_usd
                      ? `$${balance.total_usd.toFixed(2)}`
                      : "$0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {tab === "transactions" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Transaction History
              </h2>
              <span className="text-xs text-muted-foreground">
                {transactions.length} records
              </span>
            </div>
            <TransactionsTable
              transactions={transactions}
              loading={txLoading}
            />
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === "profile" && (
          <ProfileSection
            fullName={investor.full_name}
            investorNumber={investor.investor_number}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={tab}
        onTabChange={(newTab) => {
          setTab(newTab);
          if (newTab === "transactions" && transactions.length === 0) {
            loadTransactions();
          }
        }}
        onLogout={async () => {
          await fetch("/api/logout", { method: "POST" });
          window.location.reload();
        }}
      />
    </div>
  );
}
