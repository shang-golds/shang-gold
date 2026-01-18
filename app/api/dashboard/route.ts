import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ⚡ Gold price from XAUT (Tether Gold) — free
async function fetchGoldPrice18K() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=usd",
      {
        cache: "no-store",
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);
    if (!res.ok) return null;

    const data = await res.json();
    const pricePerOunce = data?.["tether-gold"]?.usd;
    if (!pricePerOunce) return null;

    const pricePerGram24k = pricePerOunce / 31.1035;
    return Number((pricePerGram24k * 0.75).toFixed(2)); // 18K
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const investorId = cookieStore.get("investor_id")?.value;

  if (!investorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 👤 Investor info
  const { data: investor, error: investorError } = await supabase
    .from("investors")
    .select("id, full_name, investor_number")
    .eq("id", investorId)
    .single();

  if (investorError || !investor) {
    return NextResponse.json({ error: "Investor not found" }, { status: 404 });
  }

  // 💰 Balance (FROM VIEW — source of truth)
  const { data: balance, error: balanceError } = await supabase
    .from("investor_balances")
    .select(
      "deposit_grams, profit_grams, withdrawn_grams, total_grams"
    )
    .eq("investor_id", investorId)
    .single();

  if (balanceError || !balance) {
    return NextResponse.json({
      investor,
      balance: {
        deposit_grams: 0,
        profit_grams: 0,
        withdrawn_grams: 0,
        total_grams: 0,
        gold_price_18k_usd: null,
        total_usd: null,
      },
    });
  }

  // 💲 Gold price
  const goldPrice18k = await fetchGoldPrice18K();
  const totalUsd =
    goldPrice18k !== null
      ? Number((balance.total_grams * goldPrice18k).toFixed(2))
      : null;

  return NextResponse.json({
    investor,
    balance: {
      ...balance,
      gold_price_18k_usd: goldPrice18k,
      total_usd: totalUsd,
      price_source: "XAUT (Tether Gold)",
    },
  });
}
