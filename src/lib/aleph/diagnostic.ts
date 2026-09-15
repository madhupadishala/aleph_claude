export type Dimension =
  "visibility" | "trust" | "pricing" | "retention" | "authority";

type Option = {
  label: string;
  detail: string;
  scores: Record<Dimension, number>;
};

type Question = {
  id: string;
  eyebrow: string;
  prompt: string;
  options: Option[];
};

export const questions: Question[] = [
  {
    id: "local_visibility",
    eyebrow: "Signal 1 of 7",
    prompt:
      "A patient searches near your clinic area for your service. What will they clearly find?",
    options: [
      {
        label:
          "A complete Google profile with services, photos, reviews, and booking clarity",
        detail: "Strong local discovery foundation.",
        scores: {
          visibility: 18,
          trust: 12,
          pricing: 0,
          retention: 0,
          authority: 6,
        },
      },
      {
        label:
          "My name appears somewhere online, but the profile is not maintained",
        detail: "Presence exists, but trust is weak.",
        scores: {
          visibility: 9,
          trust: 5,
          pricing: 0,
          retention: 0,
          authority: 2,
        },
      },
      {
        label: "Mostly referrals. I have not worked on search visibility",
        detail: "High dependency on word of mouth.",
        scores: {
          visibility: 2,
          trust: 2,
          pricing: 0,
          retention: 0,
          authority: 0,
        },
      },
    ],
  },
  {
    id: "website_trust",
    eyebrow: "Signal 2 of 7",
    prompt:
      "Before booking, a patient opens your website or profile. What tells them you are the right clinician?",
    options: [
      {
        label:
          "Clear services, conditions handled, doctor story, FAQs, testimonials, and next steps",
        detail: "Patients can understand fit before calling.",
        scores: {
          visibility: 4,
          trust: 18,
          pricing: 2,
          retention: 4,
          authority: 10,
        },
      },
      {
        label: "Basic qualification, clinic address, and phone number",
        detail: "Functional, but not persuasive.",
        scores: {
          visibility: 2,
          trust: 8,
          pricing: 0,
          retention: 0,
          authority: 3,
        },
      },
      {
        label: "Nothing structured. I explain everything only on call",
        detail: "Every patient starts cold.",
        scores: {
          visibility: 0,
          trust: 2,
          pricing: 0,
          retention: 0,
          authority: 0,
        },
      },
    ],
  },
  {
    id: "pricing",
    eyebrow: "Signal 3 of 7",
    prompt:
      "A patient asks your consultation fee and compares you with cheaper options. How do you handle it?",
    options: [
      {
        label:
          "I explain value, consultation structure, expected care pathway, and quote confidently",
        detail: "Pricing is connected to clinical clarity.",
        scores: {
          visibility: 0,
          trust: 8,
          pricing: 20,
          retention: 4,
          authority: 7,
        },
      },
      {
        label: "I quote the fee, but I feel pressure to justify or discount",
        detail: "Value is present, confidence is leaking.",
        scores: {
          visibility: 0,
          trust: 4,
          pricing: 9,
          retention: 1,
          authority: 2,
        },
      },
      {
        label: "I reduce fee quickly because I fear losing the patient",
        detail: "This protects today and hurts the practice.",
        scores: {
          visibility: 0,
          trust: 1,
          pricing: 2,
          retention: 0,
          authority: 0,
        },
      },
    ],
  },
  {
    id: "booking_flow",
    eyebrow: "Signal 4 of 7",
    prompt:
      "A patient decides to book. How smooth is the journey from interest to appointment?",
    options: [
      {
        label:
          "They can call, message, see timings, understand location, and confirm quickly",
        detail: "Low friction booking flow.",
        scores: {
          visibility: 5,
          trust: 8,
          pricing: 2,
          retention: 8,
          authority: 2,
        },
      },
      {
        label: "They can call, but follow-up depends on manual availability",
        detail: "Some leads may drop silently.",
        scores: {
          visibility: 2,
          trust: 4,
          pricing: 0,
          retention: 4,
          authority: 1,
        },
      },
      {
        label: "There is no defined booking flow",
        detail: "Interest is leaking before conversion.",
        scores: {
          visibility: 0,
          trust: 1,
          pricing: 0,
          retention: 1,
          authority: 0,
        },
      },
    ],
  },
  {
    id: "patient_education",
    eyebrow: "Signal 5 of 7",
    prompt: "How do you educate patients before or after consultation?",
    options: [
      {
        label:
          "I use structured FAQs, condition explainers, pre-visit guidance, and follow-up education",
        detail: "Education builds trust and recall.",
        scores: {
          visibility: 4,
          trust: 14,
          pricing: 3,
          retention: 14,
          authority: 10,
        },
      },
      {
        label: "I occasionally post or explain manually",
        detail: "Useful, but inconsistent.",
        scores: {
          visibility: 2,
          trust: 7,
          pricing: 1,
          retention: 6,
          authority: 4,
        },
      },
      {
        label: "I do not have a patient education system",
        detail: "Expertise is not compounding.",
        scores: {
          visibility: 0,
          trust: 2,
          pricing: 0,
          retention: 1,
          authority: 0,
        },
      },
    ],
  },
  {
    id: "reviews",
    eyebrow: "Signal 6 of 7",
    prompt:
      "How do patient reviews, testimonials, and proof of care currently work?",
    options: [
      {
        label:
          "I ethically collect reviews and show proof through patient-safe, compliant formats",
        detail: "Trust compounds over time.",
        scores: {
          visibility: 8,
          trust: 16,
          pricing: 2,
          retention: 5,
          authority: 8,
        },
      },
      {
        label: "Some reviews exist, but I do not actively manage them",
        detail: "Proof exists, but it is underused.",
        scores: {
          visibility: 4,
          trust: 8,
          pricing: 0,
          retention: 2,
          authority: 3,
        },
      },
      {
        label: "I avoid asking and have very little visible proof",
        detail: "Patients have no external confidence signal.",
        scores: {
          visibility: 1,
          trust: 2,
          pricing: 0,
          retention: 0,
          authority: 0,
        },
      },
    ],
  },
  {
    id: "authority",
    eyebrow: "Signal 7 of 7",
    prompt:
      "If someone studies your public presence for 60 seconds, what position do they remember?",
    options: [
      {
        label:
          "They can clearly remember my specialty, approach, patient type, and why I am different",
        detail: "You are becoming a clinician brand.",
        scores: {
          visibility: 5,
          trust: 10,
          pricing: 8,
          retention: 3,
          authority: 20,
        },
      },
      {
        label: "They know I am qualified, but not what makes me distinct",
        detail: "Competence is visible, positioning is soft.",
        scores: {
          visibility: 2,
          trust: 5,
          pricing: 3,
          retention: 1,
          authority: 8,
        },
      },
      {
        label: "My positioning is not defined yet",
        detail: "You are present, but not memorable.",
        scores: {
          visibility: 0,
          trust: 2,
          pricing: 0,
          retention: 0,
          authority: 2,
        },
      },
    ],
  },
];

export const maxScores: Record<Dimension, number> = questions.reduce(
  (acc, question) => {
    const best = question.options.reduce(
      (memo, option) => {
        (Object.keys(option.scores) as Dimension[]).forEach((key) => {
          memo[key] = Math.max(memo[key], option.scores[key]);
        });
        return memo;
      },
      {
        visibility: 0,
        trust: 0,
        pricing: 0,
        retention: 0,
        authority: 0,
      } as Record<Dimension, number>,
    );

    (Object.keys(best) as Dimension[]).forEach((key) => {
      acc[key] += best[key];
    });

    return acc;
  },
  { visibility: 0, trust: 0, pricing: 0, retention: 0, authority: 0 } as Record<
    Dimension,
    number
  >,
);

export const labels: Record<Dimension, string> = {
  visibility: "Local Visibility",
  trust: "Patient Trust",
  pricing: "Pricing Confidence",
  retention: "Patient Retention",
  authority: "Brand Authority",
};

export const prescriptions: Record<Dimension, string> = {
  visibility:
    "Your strongest growth opportunity is becoming easier to discover when nearby patients search for your service.",
  trust:
    "Your practice needs stronger proof before the patient calls: service clarity, doctor story, FAQs, and visible confidence signals.",
  pricing:
    "Your clinical value needs a clearer pricing structure so you stop negotiating against yourself.",
  retention:
    "You need a stronger follow-up and patient education rhythm so patients remember, return, and refer.",
  authority:
    "Your public positioning needs to become sharper so patients remember what you stand for.",
};

export const packageFit = [
  {
    min: 85,
    name: "Aleph Authority",
    copy: "You already have a base. The next move is premium positioning, content authority, and scale.",
  },
  {
    min: 65,
    name: "Aleph Growth",
    copy: "You have enough foundation to convert faster with better trust assets, local SEO, and pricing structure.",
  },
  {
    min: 0,
    name: "Aleph Starter",
    copy: "Your priority is a strong digital foundation: profile, website, services, booking clarity, and proof.",
  },
];

export function percent(value: number, max: number) {
  return Math.round((value / max) * 100);
}

export function scoreAnswers(answers: unknown) {
  if (
    !Array.isArray(answers) ||
    answers.length !== questions.length ||
    !answers.every((n) => Number.isInteger(n) && n >= 0 && n < 3)
  )
    throw new Error("Complete all seven diagnostic questions.");
  const normalized = (Object.keys(labels) as Dimension[]).map((key) => ({
    key,
    label: labels[key],
    score: percent(
      answers.reduce(
        (sum, answer, index) =>
          sum + questions[index].options[answer].scores[key],
        0,
      ),
      maxScores[key],
    ),
  }));
  const overall = Math.round(
    normalized.reduce((sum, item) => sum + item.score, 0) / normalized.length,
  );
  const weakest = normalized.reduce(
    (low, item) => (item.score < low.score ? item : low),
    normalized[0],
  );
  const fit = packageFit.find((item) => overall >= item.min) ?? packageFit[2];
  return { normalized, overall, weakest, fit };
}
