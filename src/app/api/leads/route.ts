import { NextResponse } from "next/server";
import { getSupabaseAdmin, type PracticeLead } from "@/lib/supabase/server";

const scoreKeys = [
  "overall_score",
  "visibility_score",
  "trust_score",
  "pricing_score",
  "retention_score",
  "authority_score"
] as const;

function isEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function readScore(payload: Partial<PracticeLead>, key: (typeof scoreKeys)[number]) {
  const value = payload[key];

  if (typeof value !== "number" || value < 0 || value > 100) {
    throw new Error(key + " must be a score between 0 and 100.");
  }

  return value;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<PracticeLead>;
    const emailInput = payload.email;
    const specialtyInput = payload.specialty;

    if (!isEmail(emailInput)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    if (typeof specialtyInput !== "string" || specialtyInput.trim().length < 2) {
      return NextResponse.json({ error: "Clinical specialty is required." }, { status: 400 });
    }

    const email = emailInput.trim().toLowerCase();
    const specialty = specialtyInput.trim();

    const lead: PracticeLead = {
      name: payload.name?.trim() || null,
      email,
      specialty,
      overall_score: readScore(payload, "overall_score"),
      visibility_score: readScore(payload, "visibility_score"),
      trust_score: readScore(payload, "trust_score"),
      pricing_score: readScore(payload, "pricing_score"),
      retention_score: readScore(payload, "retention_score"),
      authority_score: readScore(payload, "authority_score"),
      weakest_area: payload.weakest_area?.trim() || "",
      package_fit: payload.package_fit?.trim() || "",
      status: "New",
      notes: null
    };

    if (!lead.weakest_area || !lead.package_fit) {
      return NextResponse.json({ error: "Diagnostic result data is incomplete." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("practice_leads").insert(lead).select("id").single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save lead.";
    const status = message.includes("score between") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
