import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const investor_number = body.investor_number;
    const pin = body.pin;

    if (!investor_number || !pin) {
      return NextResponse.json(
        { error: "investor_number and pin are required" },
        { status: 400 }
      );
    }

    const { data: investor, error } = await supabase
      .from("investors")
      .select("id, full_name, investor_number")
      .eq("investor_number", investor_number)
      .eq("pin", pin)
      .single();

    if (error || !investor) {
      return NextResponse.json(
        { error: "Invalid investor number or PIN" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      investor: {
        id: investor.id,
        full_name: investor.full_name,
        investor_number: investor.investor_number,
      },
    });

    response.cookies.set("investor_id", investor.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
