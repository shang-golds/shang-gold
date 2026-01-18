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

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);

  const [investorNumber, setInvestorNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setInvestor(data.investor);
        setBalance(data.balance);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

  if (loading) {
    return <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>;
  }

  // 🔐 Login
  if (!investor) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <Image src="/logo.png" alt="Shang Gold" width={120} height={120} />

          <h2 style={styles.brand}>SHANG GOLD</h2>
          <p style={styles.subtitle}>Gold-Linked Investment Dashboard</p>

          <input
            style={styles.input}
            placeholder="Investor Number"
            value={investorNumber}
            onChange={(e) => setInvestorNumber(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />

          <button style={styles.primaryButton} onClick={login}>
            Login
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
          <Image src="/logo.png" alt="Shang Gold" width={90} height={90} />
          <h1 style={styles.brand}>SHANG GOLD</h1>
          <p style={styles.subtitle}>Gold-Linked Investment Dashboard</p>
        </div>

        {/* Investor Info */}
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

        {/* Balance */}
        <div style={styles.section}>
          <div style={styles.row}>
            <span>Investment</span>
            <strong>{balance?.deposit_grams ?? 0} g</strong>
          </div>
          <div style={styles.row}>
            <span>Profit</span>
            <strong>{balance?.profit_grams ?? 0} g</strong>
          </div>
          <div style={styles.highlight}>
            <span>Total Gold Balance</span>
            <strong>{balance?.total_grams ?? 0} g</strong>
          </div>
        </div>

        {/* USD */}
        <div style={styles.section}>
          <div style={styles.row}>
            <span>Gold Price (18K)</span>
            <strong>
              {balance?.gold_price_18k_usd
                ? `$${balance.gold_price_18k_usd.toFixed(2)} / g`
                : "Loading..."}
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

        {/* Logout */}
        <button
          style={styles.logout}
          onClick={async () => {
            await fetch("/api/logout", { method: "POST" });
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// 🎨 Styles
const styles: any = {
  page: {
    background: "linear-gradient(135deg, #0f0f0f, #1c1c1c)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial",
  },
  card: {
    background: "#fff",
    width: 360,
    padding: 25,
    borderRadius: 12,
    textAlign: "center",
    borderTop: "6px solid #d4af37",
  },
  cardWide: {
    background: "#fff",
    width: 480,
    padding: 30,
    borderRadius: 14,
    borderTop: "6px solid #d4af37",
  },
  header: {
    textAlign: "center",
    marginBottom: 25,
  },
  brand: {
    color: "#d4af37",
    margin: "10px 0 5px",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: "#777",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: "1px solid #eee",
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
    fontSize: 16,
    marginTop: 10,
  },
  highlightGold: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    color: "#b88900",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  primaryButton: {
    width: "100%",
    padding: 10,
    background: "#d4af37",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  logout: {
    width: "100%",
    marginTop: 20,
    padding: 10,
    background: "#222",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
};
