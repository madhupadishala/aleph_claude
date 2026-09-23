export type Dimension =
  | "visibility"
  | "trust"
  | "pricing"
  | "retention"
  | "authority"
  | "operations"
  | "affordability";

export type Phase =
  | "context"
  | "acquisition"
  | "economics"
  | "operations"
  | "affordability";

type Scores = Record<Dimension, number>;

type Option = {
  label: string;
  detail: string;
  scores?: Partial<Scores>;
};

export type Question = {
  id: string;
  phase: Phase;
  eyebrow: string;
  prompt: string;
  options: Option[];
};

const zeroScores = (): Scores => ({
  visibility: 0,
  trust: 0,
  pricing: 0,
  retention: 0,
  authority: 0,
  operations: 0,
  affordability: 0,
});

export const phaseLabels: Record<Phase, string> = {
  context: "Practice context",
  acquisition: "Patient acquisition",
  economics: "Practice economics",
  operations: "Operational capacity",
  affordability: "Patient affordability",
};

export const questions: Question[] = [
  {
    id: "practice_age",
    phase: "context",
    eyebrow: "Practice context",
    prompt: "How long has this practice been operating in its current form?",
    options: [
      {
        label: "Less than 1 year",
        detail: "Still building the first repeatable foundation.",
      },
      {
        label: "1 to 2 years",
        detail: "Early practice with enough history to see patterns.",
      },
      {
        label: "More than 2 to 5 years",
        detail: "Established practice with a meaningful operating history.",
      },
      {
        label: "More than 5 years",
        detail: "Mature practice with long-term operating history.",
      },
    ],
  },
  {
    id: "performance",
    phase: "context",
    eyebrow: "Practice context",
    prompt: "Are your current patient numbers where you want them to be?",
    options: [
      {
        label: "Yes — consistently at or above my target",
        detail: "Demand is not the immediate problem.",
      },
      {
        label: "Some months are good, some are not",
        detail: "The practice has demand, but it is inconsistent.",
      },
      {
        label: "No — patient numbers are clearly below target",
        detail: "The practice is underperforming against its own goal.",
      },
    ],
  },
  {
    id: "capacity",
    phase: "context",
    eyebrow: "Practice context",
    prompt: "What best describes your appointment capacity today?",
    options: [
      {
        label: "Frequently full, with waiting or spillover demand",
        detail: "Demand may be pressing against current capacity.",
      },
      {
        label: "Usually balanced — busy, but with some room",
        detail: "Current demand and capacity are broadly aligned.",
      },
      {
        label: "Many appointment slots remain unused",
        detail: "There is available capacity that patient growth could use.",
      },
    ],
  },
  {
    id: "practice_structure",
    phase: "context",
    eyebrow: "Practice context",
    prompt: "How is the practice currently structured?",
    options: [
      {
        label: "I work mostly alone",
        detail: "Most clinical and practice activity depends on you.",
      },
      {
        label: "I have a nurse, assistant, or small support team",
        detail: "Some work can be structured around a trained team.",
      },
      {
        label: "We are a multi-clinician or multi-service practice",
        detail: "Growth and operations need to work across a wider team.",
      },
    ],
  },
  {
    id: "support_preference",
    phase: "context",
    eyebrow: "Practice context",
    prompt: "If you decide to improve the practice, what type of support do you want?",
    options: [
      {
        label: "Give me the plan — I can implement it",
        detail: "You mainly need direction, structure, and tools.",
      },
      {
        label: "Work with me — I can implement with support",
        detail: "You want strategy plus guided execution.",
      },
      {
        label: "I want a team to manage most of the execution",
        detail: "Your time is better spent on clinical work or leadership.",
      },
    ],
  },
  {
    id: "primary_goal",
    phase: "context",
    eyebrow: "Practice context",
    prompt: "What would make the biggest difference to your practice right now?",
    options: [
      {
        label: "Build a proper foundation",
        detail: "Get the basics of discovery, trust, and booking right.",
      },
      {
        label: "Bring in more of the right patients",
        detail: "Use existing capacity more consistently.",
      },
      {
        label: "Run the practice more efficiently",
        detail: "Reduce avoidable friction and protect clinician time.",
      },
      {
        label: "Build a stronger premium or specialist position",
        detail: "Become more differentiated and memorable.",
      },
    ],
  },
  {
    id: "consultation_time",
    phase: "context",
    eyebrow: "Practice context",
    prompt:
      "For a typical consultation, including time spent speaking with the patient or family, how much clinician-facing time is usually used?",
    options: [
      { label: "Under 10 minutes", detail: "Short clinician-facing visit." },
      { label: "10 to 20 minutes", detail: "Moderate clinician-facing visit." },
      { label: "20 to 30 minutes", detail: "Longer clinician-facing visit." },
      { label: "More than 30 minutes", detail: "Extended clinician-facing visit." },
    ],
  },
  {
    id: "local_visibility",
    phase: "acquisition",
    eyebrow: "Patient acquisition",
    prompt:
      "A patient searches near your clinic area for your service. What will they clearly find?",
    options: [
      {
        label:
          "A complete profile with services, accurate information, reviews, and booking clarity",
        detail: "Strong local discovery foundation.",
        scores: { visibility: 20, trust: 7, authority: 4 },
      },
      {
        label: "My name appears online, but the profile is not consistently maintained",
        detail: "Presence exists, but discovery and trust are inconsistent.",
        scores: { visibility: 10, trust: 4, authority: 2 },
      },
      {
        label: "Mostly referrals — I have not built structured local visibility",
        detail: "High dependency on word of mouth.",
        scores: { visibility: 2, trust: 2 },
      },
    ],
  },
  {
    id: "website_trust",
    phase: "acquisition",
    eyebrow: "Patient acquisition",
    prompt:
      "Before booking, a patient opens your website or profile. How easily can they understand why you may be the right clinician for them?",
    options: [
      {
        label:
          "Services, clinician story, common questions, proof, and next steps are clear",
        detail: "Patients can understand fit before calling.",
        scores: { trust: 20, authority: 8, visibility: 4 },
      },
      {
        label: "They can see qualifications, address, and contact details",
        detail: "Functional information exists, but persuasion is limited.",
        scores: { trust: 9, authority: 3, visibility: 2 },
      },
      {
        label: "There is very little structured information — I explain it on call",
        detail: "Every inquiry starts cold.",
        scores: { trust: 2, authority: 1 },
      },
    ],
  },
  {
    id: "pricing_confidence",
    phase: "economics",
    eyebrow: "Practice economics",
    prompt:
      "When a patient asks about your consultation fee or compares you with a cheaper option, what normally happens?",
    options: [
      {
        label:
          "I explain the consultation structure and value clearly and quote with confidence",
        detail: "Pricing is supported by a clear patient proposition.",
        scores: { pricing: 20, trust: 6, authority: 5 },
      },
      {
        label: "I quote the fee, but often feel pressure to justify or discount it",
        detail: "Value exists, but pricing confidence is inconsistent.",
        scores: { pricing: 9, trust: 3, authority: 2 },
      },
      {
        label: "I reduce the fee quickly because I worry the patient will leave",
        detail: "Pricing is being driven by fear of losing the inquiry.",
        scores: { pricing: 2, trust: 1 },
      },
    ],
  },
  {
    id: "booking_retention",
    phase: "acquisition",
    eyebrow: "Patient acquisition",
    prompt:
      "From first inquiry to booking and follow-up, how structured is the patient journey?",
    options: [
      {
        label:
          "Booking, reminders, follow-up, and next steps are clear and consistently handled",
        detail: "Low-friction patient journey.",
        scores: { retention: 20, trust: 7, operations: 5 },
      },
      {
        label: "Booking works, but reminders or follow-up depend on manual effort",
        detail: "Some patients can silently fall out of the journey.",
        scores: { retention: 9, trust: 4, operations: 3 },
      },
      {
        label: "There is no consistent booking or follow-up workflow",
        detail: "Interest and continuity can leak at several points.",
        scores: { retention: 2, trust: 1, operations: 1 },
      },
    ],
  },
  {
    id: "authority",
    phase: "acquisition",
    eyebrow: "Patient acquisition",
    prompt:
      "If someone studies your public presence for 60 seconds, how clearly will they remember what you are known for?",
    options: [
      {
        label:
          "My specialty, approach, patient type, and differentiation are immediately clear",
        detail: "The practice has a memorable position.",
        scores: { authority: 20, trust: 6, pricing: 4 },
      },
      {
        label: "They can see I am qualified, but not what makes the practice distinct",
        detail: "Competence is visible; positioning is soft.",
        scores: { authority: 9, trust: 4, pricing: 2 },
      },
      {
        label: "My public positioning is not defined yet",
        detail: "The practice is present, but not memorable.",
        scores: { authority: 2, trust: 2 },
      },
    ],
  },
  {
    id: "workflow_delegation",
    phase: "operations",
    eyebrow: "Operational capacity",
    prompt:
      "How are routine pre-consultation and post-consultation support activities handled today?",
    options: [
      {
        label:
          "Trained staff handle structured intake/support tasks under clinic protocols, while clinical decisions stay with the clinician",
        detail: "The team protects clinician time without replacing clinical judgment.",
        scores: { operations: 20, retention: 5, trust: 4 },
      },
      {
        label:
          "Staff help with some activities, but I still repeat many routine steps myself",
        detail: "There may be time that can be reorganised safely.",
        scores: { operations: 10, retention: 3, trust: 3 },
      },
      {
        label:
          "I personally handle nearly everything before, during, and after the consultation",
        detail: "The practice is highly dependent on clinician time.",
        scores: { operations: 3, retention: 1, trust: 2 },
      },
    ],
  },
  {
    id: "patient_affordability",
    phase: "affordability",
    eyebrow: "Patient affordability",
    prompt:
      "When you consider consultation, necessary medicines, diagnostics, and convenience together, how actively do you manage the patient's total cost of care?",
    options: [
      {
        label:
          "We routinely consider total patient cost and look for transparent, clinically appropriate lower-cost options where possible",
        detail: "Affordability is treated as part of the patient experience.",
        scores: { affordability: 20, trust: 6, retention: 4 },
      },
      {
        label:
          "I know my consultation fee, but medicine and diagnostic costs are mostly outside the practice workflow",
        detail: "Patient cost is visible only in parts.",
        scores: { affordability: 10, trust: 3, retention: 2 },
      },
      {
        label:
          "Patients can be surprised by downstream medicine, test, or access costs",
        detail: "Affordability friction is not being systematically reviewed.",
        scores: { affordability: 3, trust: 1 },
      },
    ],
  },
];

export const scoredQuestions = questions.filter((question) => question.options.some((option) => option.scores));

export const maxScores: Scores = scoredQuestions.reduce((acc, question) => {
  const best = question.options.reduce((memo, option) => {
    const scores = { ...zeroScores(), ...(option.scores ?? {}) };
    (Object.keys(scores) as Dimension[]).forEach((key) => {
      memo[key] = Math.max(memo[key], scores[key]);
    });
    return memo;
  }, zeroScores());
  (Object.keys(best) as Dimension[]).forEach((key) => {
    acc[key] += best[key];
  });
  return acc;
}, zeroScores());

export const labels: Record<Dimension, string> = {
  visibility: "Local Visibility",
  trust: "Patient Trust",
  pricing: "Pricing Confidence",
  retention: "Patient Retention",
  authority: "Brand Authority",
  operations: "Operational Capacity",
  affordability: "Patient Affordability",
};

export const prescriptions: Record<Dimension, string> = {
  visibility:
    "Your strongest opportunity is becoming easier to discover when the right local patients look for your service.",
  trust:
    "Your practice needs stronger trust signals before the patient calls: service clarity, clinician story, proof, and a confident next step.",
  pricing:
    "Your clinical value needs a clearer pricing story so the fee is explained consistently instead of negotiated reactively.",
  retention:
    "Your patient journey needs a stronger booking, reminder, education, and follow-up rhythm so fewer patients silently drop away.",
  authority:
    "Your public positioning needs to become sharper so people remember what the practice is specifically known for.",
  operations:
    "Your practice may be using clinician time for routine workflow that could be reviewed and reorganised safely with trained staff and clear clinic protocols.",
  affordability:
    "The patient's total cost of care needs more visibility so necessary treatment, medicines, diagnostics, and access feel financially predictable where possible.",
};

const getAnswer = (answers: number[], id: string) => {
  const index = questions.findIndex((question) => question.id === id);
  return index >= 0 ? answers[index] : -1;
};

export function percent(value: number, max: number) {
  return max > 0 ? Math.round((value / max) * 100) : 100;
}

function buildFit(answers: number[], normalized: Array<{ key: Dimension; label: string; score: number }>, overall: number) {
  const age = getAnswer(answers, "practice_age");
  const performance = getAnswer(answers, "performance");
  const capacity = getAnswer(answers, "capacity");
  const support = getAnswer(answers, "support_preference");
  const goal = getAnswer(answers, "primary_goal");
  const visibility = normalized.find((item) => item.key === "visibility")?.score ?? 0;
  const trust = normalized.find((item) => item.key === "trust")?.score ?? 0;
  const authority = normalized.find((item) => item.key === "authority")?.score ?? 0;

  if (support === 2) {
    return {
      name: "Aleph Concierge",
      copy:
        "You want execution off your plate. The best starting point is a managed plan where Aleph coordinates the growth system while you retain clinical and business decisions.",
      reason: "Your preferred operating model is done-for-you execution, not another self-service plan.",
    };
  }

  if (performance === 2 && age >= 2) {
    return {
      name: "Aleph Growth",
      copy:
        capacity === 2
          ? "Your practice is established but under target while appointment capacity remains available. The first priority is patient acquisition, trust, and conversion — not simply adding more capacity."
          : "Your practice is established but under target. Aleph Growth should focus first on the bottlenecks limiting consistent patient flow and conversion.",
      reason: "Practice age shows maturity, but current performance shows that the growth system is not yet producing the numbers you want.",
    };
  }

  if ((goal === 3 || performance === 0) && overall >= 72 && authority >= 55 && visibility >= 55 && trust >= 55) {
    return {
      name: "Aleph Authority",
      copy:
        "Your operating foundation is comparatively strong. The next opportunity is differentiation, specialist positioning, content authority, and compounding reputation.",
      reason: "The basics are strong enough that authority-building can create more leverage than another foundation rebuild.",
    };
  }

  if ((age <= 1 && (visibility < 50 || trust < 50)) || (goal === 0 && overall < 60)) {
    return {
      name: "Aleph Starter",
      copy:
        "Your immediate priority is a reliable foundation: local presence, clear services, patient trust, and a simple booking journey.",
      reason: "The practice will get more value from fixing foundational discovery and trust before adding advanced growth layers.",
    };
  }

  return {
    name: "Aleph Growth",
    copy:
      "Your practice has enough foundation to benefit from a focused growth system across patient acquisition, conversion, pricing, retention, and operational improvement.",
    reason: "The next constraint is no longer one basic setup task; it is making several parts of the practice work together consistently.",
  };
}

function buildOperationalInsight(answers: number[]) {
  const capacity = getAnswer(answers, "capacity");
  const performance = getAnswer(answers, "performance");
  const workflow = getAnswer(answers, "workflow_delegation");
  const consult = getAnswer(answers, "consultation_time");

  if (performance === 2 && capacity === 2) {
    return "You report patient numbers below target while many appointment slots remain unused. Available capacity exists, so the immediate constraint is more likely patient acquisition, trust, or conversion than consultation speed.";
  }
  if (capacity === 0 && workflow >= 1) {
    return "Demand is pressing against capacity while routine support work still depends heavily on the clinician. Review which standardized non-diagnostic tasks can be handled by trained staff under clinic protocols before pushing harder for more demand.";
  }
  if (capacity === 0 && workflow === 0) {
    return "Demand is pressing against capacity, but team-supported workflow is already relatively structured. Capacity decisions should now consider case mix, clinically appropriate consultation time, staffing, and scheduling rather than a generic global consultation-time target.";
  }
  if (consult >= 2 && workflow >= 1) {
    return "Your consultations are relatively long and routine support work still returns to the clinician. That does not mean consultations should be shortened; it means the workflow is worth reviewing for safe, protocol-based delegation and repeated explanations that trained staff can reinforce.";
  }
  return "Current answers do not show a clear capacity emergency. Protect appropriate clinical time and improve workflow only where it removes avoidable repetition or administrative friction.";
}

function buildAffordabilityInsight(answers: number[]) {
  const affordability = getAnswer(answers, "patient_affordability");
  if (affordability === 2) {
    return "Patients may be experiencing downstream cost surprises. Review total episode-of-care friction: consultation, clinically necessary medicines, diagnostics, and travel/convenience. Focus on transparent patient-facing prices and clinically appropriate lower-cost options — not referral commissions.";
  }
  if (affordability === 1) {
    return "Your consultation price is visible, but medicine and diagnostic costs sit outside the practice workflow. Mapping common patient-facing costs can reveal affordability opportunities without changing clinical judgment.";
  }
  return "Affordability is already being treated as part of the patient experience. Keep monitoring whether lower-cost clinically appropriate medicine and diagnostic options remain accessible and transparent.";
}

function contextLabel(answers: number[], id: string, labelsForOptions: string[]) {
  const value = getAnswer(answers, id);
  return labelsForOptions[value] ?? "Not assessed";
}

export function scoreAnswers(answers: unknown) {
  if (
    !Array.isArray(answers) ||
    answers.length !== questions.length ||
    !answers.every(
      (answer, index) =>
        Number.isInteger(answer) &&
        answer >= 0 &&
        answer < questions[index].options.length,
    )
  ) {
    throw new Error(`Complete all ${questions.length} practice intelligence questions.`);
  }

  const typedAnswers = answers as number[];
  const totals = zeroScores();
  scoredQuestions.forEach((question) => {
    const questionIndex = questions.findIndex((item) => item.id === question.id);
    const option = question.options[typedAnswers[questionIndex]];
    const scores = { ...zeroScores(), ...(option.scores ?? {}) };
    (Object.keys(scores) as Dimension[]).forEach((key) => {
      totals[key] += scores[key];
    });
  });

  const normalized = (Object.keys(labels) as Dimension[]).map((key) => ({
    key,
    label: labels[key],
    score: percent(totals[key], maxScores[key]),
  }));

  const overall = Math.round(
    normalized.reduce((sum, item) => sum + item.score, 0) / normalized.length,
  );
  const weakest = normalized.reduce(
    (low, item) => (item.score < low.score ? item : low),
    normalized[0],
  );
  const priorities = [...normalized].sort((a, b) => a.score - b.score).slice(0, 3);
  const fit = buildFit(typedAnswers, normalized, overall);

  const stage = contextLabel(typedAnswers, "practice_age", [
    "New practice (<1 year)",
    "Early practice (1–2 years)",
    "Established practice (2–5 years)",
    "Mature practice (5+ years)",
  ]);
  const performance = contextLabel(typedAnswers, "performance", [
    "At or above target",
    "Inconsistent performance",
    "Below target",
  ]);
  const capacity = contextLabel(typedAnswers, "capacity", [
    "Demand pressing against capacity",
    "Broadly balanced",
    "Available appointment capacity",
  ]);
  const consultationTime = contextLabel(typedAnswers, "consultation_time", [
    "Under 10 minutes",
    "10–20 minutes",
    "20–30 minutes",
    "More than 30 minutes",
  ]);

  return {
    normalized,
    overall,
    weakest,
    priorities,
    fit,
    context: { stage, performance, capacity, consultationTime },
    operationalInsight: buildOperationalInsight(typedAnswers),
    affordabilityInsight: buildAffordabilityInsight(typedAnswers),
  };
}
