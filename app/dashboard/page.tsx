"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!investorNumber || !pin) {
      setError("Please enter both your investor number and PIN.");
      return;
    }

    setIsSubmitting(true);
    try {
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
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p style={{ color: "#fff", textAlign: "center" }}>Loading...</p>;
  }

  // 🔐 Login
  if (!investor) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <Image src="/logo.png" alt="Shang Gold" width={120} height={120} />
          <h2 style={styles.brand}>SHANG GOLD</h2>
          <p style={styles.subtitle}>Gold-Linked Investment Dashboard</p>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="investor-number">
              Investor Number
            </label>
            <input
              id="investor-number"
              style={styles.input}
              placeholder="e.g., 102938"
              value={investorNumber}
              onChange={(e) => setInvestorNumber(e.target.value)}
              autoComplete="username"
              inputMode="numeric"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="pin">
              PIN
            </label>
            <input
              id="pin"
              style={styles.input}
              type="password"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoComplete="current-password"
              inputMode="numeric"
            />
            <p style={styles.inputHint}>Never share your PIN with anyone.</p>
          </div>

          <button
            style={{
              ...styles.primaryButton,
              ...(isSubmitting ? styles.primaryButtonDisabled : {}),
            }}
            onClick={login}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    );
  }

  // ✅ Dashboard
  return (
    <div style={styles.page}>
      <div style={styles.cardWide}>
        {/* Header */}
        <div style={styles.header}>
          <Image src="/logo.png" alt="Shang Gold" width={80} height={80} />
          <h1 style={styles.brand}>SHANG GOLD</h1>
          <p style={styles.subtitle}>Gold-Linked Investment Dashboard</p>
        </div>

        {/* ACCOUNT */}
        {tab === "account" && (
          <>
            <div style={styles.section}>
              <div style={styles.row}>
                <span>Investor</span>
                <strong>{investor.full_name}</strong>
              </div>
              <div style={styles.row}>
                <span>Investor #</span>
                <strong>{investor.investor_number}</strong>
              </div>
              <div style={styles.row}>
                <span>Status</span>
                <strong style={{ color: "green" }}>Active</strong>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.row}>
                <span>Deposits</span>
                <strong>{balance?.deposit_grams ?? 0} g</strong>
              </div>
              <div style={styles.row}>
                <span>Profit</span>
                <strong>{balance?.profit_grams ?? 0} g</strong>
              </div>
              <div style={styles.row}>
                <span>Withdrawn</span>
                <strong>{balance?.withdrawn_grams ?? 0} g</strong>
              </div>
              <div style={styles.highlight}>
                <span>Total Gold</span>
                <strong>{balance?.total_grams ?? 0} g</strong>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.row}>
                <span>Gold Price (18K)</span>
                <strong>
                  {balance?.gold_price_18k_usd
                    ? `$${balance.gold_price_18k_usd.toFixed(2)} / g`
                    : "-"}
                </strong>
              </div>
              <div style={styles.highlightGold}>
                <span>Total Value</span>
                <strong>
                  {balance?.total_usd
                    ? `$${balance.total_usd.toFixed(2)}`
                    : "$0.00"}
                </strong>
              </div>
            </div>
          </>
        )}

        {/* TRANSACTIONS */}
        {tab === "transactions" && (
          <>
            {txLoading ? (
              <p style={{ textAlign: "center" }}>Loading transactions...</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th align="left">Date</th>
                    <th align="left">Type</th>
                    <th align="right">Gold (g)</th>
                    <th align="right">USD</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: 15 }}>
                        No transactions found
                      </td>
                    </tr>
                  )}
                  {transactions.map((tx, i) => (
                    <tr key={i}>
                      <td>{tx.tx_date}</td>
                      <td>{tx.type}</td>
                      <td align="right">{tx.grams ?? "-"}</td>
                      <td align="right">{tx.usd ? `$${tx.usd}` : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* PROFILE */}
        {tab === "profile" && (
          <div style={styles.section}>
            <div style={styles.row}>
              <span>Full Name</span>
              <strong>{investor.full_name}</strong>
            </div>
            <div style={styles.row}>
              <span>Investor Number</span>
              <strong>{investor.investor_number}</strong>
            </div>
            <div style={styles.row}>
              <span>Account Status</span>
              <strong style={{ color: "green" }}>Active</strong>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div style={styles.bottomNav}>
          <button
            style={tab === "account" ? styles.navActive : styles.navBtn}
            onClick={() => setTab("account")}
          >
            Account
          </button>

          <button
            style={tab === "transactions" ? styles.navActive : styles.navBtn}
            onClick={() => {
              setTab("transactions");
              if (transactions.length === 0) loadTransactions();
            }}
          >
            Transactions
          </button>

          <button
            style={tab === "profile" ? styles.navActive : styles.navBtn}
            onClick={() => setTab("profile")}
          >
            Profile
          </button>

          <button
            style={styles.navBtn}
            onClick={async () => {
              await fetch("/api/logout", { method: "POST" });
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// 🎨 Styles
const styles: any = {
  page: {
    background: "#111",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    fontFamily: "Arial",
  },
  card: {
    background: "#fff",
    width: "100%",
    maxWidth: 360,
    padding: 24,
    borderRadius: 12,
    textAlign: "center",
    borderTop: "6px solid #d4af37",
  },
  cardWide: {
    background: "#fff",
    width: "100%",
    maxWidth: 520,
    padding: 24,
    borderRadius: 14,
    borderTop: "6px solid #d4af37",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  brand: {
    color: "#d4af37",
  },
  subtitle: {
    fontSize: 13,
    color: "#777",
  },
  section: {
    marginBottom: 20,
    borderBottom: "1px solid #eee",
    paddingBottom: 15,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  highlight: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
  },
  highlightGold: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    color: "#b88900",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  inputGroup: {
    textAlign: "left",
    marginBottom: 14,
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#444",
  },
  inputHint: {
    marginTop: 6,
    fontSize: 11,
    color: "#777",
  },
  primaryButton: {
    width: "100%",
    padding: 10,
    background: "#d4af37",
    border: "none",
    fontWeight: "bold",
    borderRadius: 6,
    cursor: "pointer",
  },
  primaryButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  bottomNav: {
    display: "flex",
    borderTop: "1px solid #ddd",
    marginTop: 20,
  },
  navBtn: {
    flex: 1,
    padding: 12,
    background: "#fff",
    border: "none",
    fontWeight: "bold",
  },
  navActive: {
    flex: 1,
    padding: 12,
    background: "#d4af37",
    border: "none",
    fontWeight: "bold",
  },
};
