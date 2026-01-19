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

  // Bottom navigation tabs
  const [tab, setTab] = useState<
    "account" | "transactions" | "profile"
  >("account");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);

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

  return (
    <div style={styles.page}>
      <div style={styles.cardWide}>
        {/* Header */}
        <div style={styles.header}>
          <Image src="/logo.png" alt="Shang Gold" width={70} height={70} />
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
                    <th>Date</th>
                    <th>Type</th>
                    <th>Gold</th>
                    <th>USD</th>
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
                      <td>{tx.grams ?? "-"}</td>
                      <td>{tx.usd ? `$${tx.usd}` : "-"}</td>
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
              <span>Name</span>
              <strong>{investor.full_name}</strong>
            </div>
            <div style={styles.row}>
              <span>Investor #</span>
              <strong>{investor.investor_number}</strong>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div style={styles.bottomNav}>
          <button
            style={tab === "account" ? styles.navActive : styles.navBtn}
            onClick={() => setTab("account")}
          >
            🏦<br />Account
          </button>

          <button
            style={tab === "transactions" ? styles.navActive : styles.navBtn}
            onClick={() => {
              setTab("transactions");
              if (transactions.length === 0) loadTransactions();
            }}
          >
            📄<br />Transactions
          </button>

          <button
            style={tab === "profile" ? styles.navActive : styles.navBtn}
            onClick={() => setTab("profile")}
          >
            👤<br />Profile
          </button>

          <button
            style={styles.navBtn}
            onClick={async () => {
              await fetch("/api/logout", { method: "POST" });
              window.location.reload();
            }}
          >
            🚪<br />Logout
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
    alignItems: "flex-start",
    paddingBottom: 80, // مساحة للشريط السفلي
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
    width: 520,
    padding: 25,
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
  table: {
    width: "100%",
    borderCollapse: "collapse",
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
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  bottomNav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    display: "flex",
    borderTop: "1px solid #ddd",
    background: "#fff",
  },
  navBtn: {
    flex: 1,
    padding: 10,
    border: "none",
    background: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  navActive: {
    flex: 1,
    padding: 10,
    border: "none",
    background: "#d4af37",
    fontWeight: "bold",
    fontSize: 12,
  },
};
