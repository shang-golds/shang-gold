import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const cookieStore = await cookies();
  const investorId = cookieStore.get("investor_id")?.value;

  if (!investorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("investor_transactions")
    .select("type, tx_date, grams, usd, note")
    .eq("investor_id", investorId)
    .order("tx_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to load transactions" }, { status: 500 });
  }

  return NextResponse.json({ transactions: data });
}
