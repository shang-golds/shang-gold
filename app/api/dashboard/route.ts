import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // قراءة Cookie
  const cookieStore = cookies();
  const investorId = cookieStore.get("investor_id")?.value;

  // إذا لا يوجد تسجيل دخول
  if (!investorId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // جلب بيانات المستثمر
  const { data: investor, error: investorError } = await supabase
    .from("investors")
    .select("id, full_name, investor_number")
    .eq("id", investorId)
    .single();

  if (investorError || !investor) {
    return NextResponse.json(
      { error: "Investor not found" },
      { status: 404 }
    );
  }

  // مجموع الاستثمارات
  const { data: investments } = await supabase
    .from("investments")
    .select("gold_grams")
    .eq("investor_id", investorId);

  const investmentGrams =
    investments?.reduce(
      (sum, row) => sum + Number(row.gold_grams),
      0
    ) || 0;

  // مجموع الأرباح
  const { data: profits } = await supabase
    .from("monthly_profits")
    .select("profit_grams")
    .eq("investor_id", investorId);

  const profitGrams =
    profits?.reduce(
      (sum, row) => sum + Number(row.profit_grams),
      0
    ) || 0;

  return NextResponse.json({
    investor,
    balance: {
      investment_grams: investmentGrams,
      profit_grams: profitGrams,
      total_grams: investmentGrams + profitGrams,
    },
  });
}
