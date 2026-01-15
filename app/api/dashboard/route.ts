import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ⚡ سعر الذهب من XAUT (Tether Gold) — مجاني
async function fetchGoldPrice18K() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // ⏱️ 3 ثواني

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

    // سعر أونصة الذهب (24K) من XAUT
    const pricePerOunce = data?.["tether-gold"]?.usd;
    if (!pricePerOunce) return null;

    // أونصة → غرام (24K)
    const pricePerGram24k = pricePerOunce / 31.1035;

    // 18K = 75%
    return Number((pricePerGram24k * 0.75).toFixed(2));
  } catch {
    return null; // ❌ لا نعلّق الصفحة
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const investorId = cookieStore.get("investor_id")?.value;

  if (!investorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Investor
  const { data: investor } = await supabase
    .from("investors")
    .select("id, full_name, investor_number")
    .eq("id", investorId)
    .single();

  // Investments
  const { data: investments } = await supabase
    .from("investments")
    .select("gold_grams")
    .eq("investor_id", investorId);

  const investmentGrams =
    investments?.reduce((sum, row) => sum + Number(row.gold_grams), 0) || 0;

  // Profits
  const { data: profits } = await supabase
    .from("monthly_profits")
    .select("profit_grams")
    .eq("investor_id", investorId);

  const profitGrams =
    profits?.reduce((sum, row) => sum + Number(row.profit_grams), 0) || 0;

  const totalGrams = investmentGrams + profitGrams;

  // Gold price from XAUT
  const goldPrice18k = await fetchGoldPrice18K();

  const totalUsd =
    goldPrice18k !== null
      ? Number((totalGrams * goldPrice18k).toFixed(2))
      : null;

  return NextResponse.json({
    investor,
    balance: {
      investment_grams: investmentGrams,
      profit_grams: profitGrams,
      total_grams: totalGrams,
      gold_price_18k_usd: goldPrice18k,
      total_usd: totalUsd,
      price_source: "XAUT (Tether Gold)",
    },
  });
}
