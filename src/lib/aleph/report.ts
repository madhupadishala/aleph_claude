import type { PracticeLead } from "@/lib/supabase/server";

const focusPlans: Record<string, string[]> = {
  "Local Visibility": [
    "Complete Google Business Profile services, location signals, consultation hours, photos, and appointment path.",
    "Create search-ready service pages for the top three patient needs in your area.",
    "Track weekly searches, calls, direction requests, and booked consultations."
  ],
  "Patient Trust": [
    "Rewrite the clinician story so patients understand qualification, care approach, and fit.",
    "Add condition-specific FAQs and patient-safe proof points before the booking CTA.",
    "Make consultation expectations clear before the patient calls."
  ],
  "Pricing Confidence": [
    "Separate consultation fee, follow-up structure, and care package logic.",
    "Prepare a value explanation script for patients comparing cheaper options.",
    "Remove apologetic pricing language from website, calls, and messages."
  ],
  "Patient Retention": [
    "Create a follow-up rhythm after first consultation.",
    "Build patient education messages for pre-visit and post-visit stages.",
    "Track repeat visits, referral sources, and drop-off points."
  ],
  "Brand Authority": [
    "Define the clinician's memorable specialty position in one sentence.",
    "Create monthly education themes around the clinician's strongest expertise.",
    "Show expertise through service pages, FAQs, reviews, and consistent public signals."
  ]
};

export function buildPracticeReport(lead: PracticeLead) {
  const focus = focusPlans[lead.weakest_area] ?? focusPlans["Patient Trust"];

  return {
    subject: "Your Aleph Practice Growth Prescription",
    preview: "Your diagnostic is saved. Here is the first version of your practice growth prescription.",
    plainText: [
      "Aleph Practice Growth Prescription",
      "",
      `Clinician: ${lead.name || "Not provided"}`,
      `Specialty: ${lead.specialty}`,
      `Overall readiness: ${lead.overall_score}%`,
      `Package fit: ${lead.package_fit}`,
      `Primary growth leak: ${lead.weakest_area}`,
      "",
      "Scorecard",
      `- Local Visibility: ${lead.visibility_score}%`,
      `- Patient Trust: ${lead.trust_score}%`,
      `- Pricing Confidence: ${lead.pricing_score}%`,
      `- Patient Retention: ${lead.retention_score}%`,
      `- Brand Authority: ${lead.authority_score}%`,
      "",
      "30-day focus",
      ...focus.map((item, index) => `${index + 1}. ${item}`),
      "",
      "Aleph helps independent clinicians turn clinical expertise into visibility, trust, footfall, and stronger pricing confidence."
    ].join("\n")
  };
}
