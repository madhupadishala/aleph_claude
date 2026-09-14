import { NextResponse } from "next/server";
import { getSupabaseAdmin, type PracticeLead } from "@/lib/supabase/server";

const dimensions = [
  "overall_score",
  "visibility_score",
  "trust_score",
  "pricing_score",
  "retention_score",
  "authority_score"
] as const;

function isEmail(value: unknown) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<PracticeLead>;

    if (!isEmail(payload.email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    if (!payload.specialty || payload.specialty.trim().length < 2) {
      return NextResponse.json({ error: "Clinical specialty is required." }, { status: 400 });
    }

    for (const key of dimensions) {
      if (typeof payload[key] !== "number" || payload[key]! < 0 || payload[key]! > 100) {
        return NextResponse.json({ error: key + " must be a score between 0 and 100." }, { status: 400 });
      }
    }

    if (!payload.weakest_area || !payload.package_fit) {
      return NextResponse.json({ error: "Diagnostic result data is incomplete." }, { status: 400 });
    }

    const lead: PracticeLead = {
      name: payload.name?.trim() || null,
      email: payload.email.trim().toLowerCase(),
      specialty: payload.specialty.trim(),
      overall_score: payload.overall_score,
      visibility_score: payload.visibility_score,
      trust_score: payload.trust_score,
      pricing_score: payload.pricing_score,
      retention_score: payload.retention_score,
      authority_score: payload.authority_score,
      weakest_area: payload.weakest_area,
      package_fit: payload.package_fit,
      status: "New",
      notes: null
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("practice_leads").insert(lead).select("id").single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save lead.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
