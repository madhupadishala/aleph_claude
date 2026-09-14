"use client";

import { type FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, Download, LineChart, Mail, RotateCcw, Sparkles } from "lucide-react";
import { trackAlephEvent } from "@/lib/analytics/events";

type Dimension = "visibility" | "trust" | "pricing" | "retention" | "authority";

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

const questions: Question[] = [
  {
    id: "local_visibility",
    eyebrow: "Signal 1 of 7",
    prompt: "A patient searches near your clinic area for your service. What will they clearly find?",
    options: [
      { label: "A complete Google profile with services, photos, reviews, and booking clarity", detail: "Strong local discovery foundation.", scores: { visibility: 18, trust: 12, pricing: 0, retention: 0, authority: 6 } },
      { label: "My name appears somewhere online, but the profile is not maintained", detail: "Presence exists, but trust is weak.", scores: { visibility: 9, trust: 5, pricing: 0, retention: 0, authority: 2 } },
      { label: "Mostly referrals. I have not worked on search visibility", detail: "High dependency on word of mouth.", scores: { visibility: 2, trust: 2, pricing: 0, retention: 0, authority: 0 } }
    ]
  },
  {
    id: "website_trust",
    eyebrow: "Signal 2 of 7",
    prompt: "Before booking, a patient opens your website or profile. What tells them you are the right clinician?",
    options: [
      { label: "Clear services, conditions handled, doctor story, FAQs, testimonials, and next steps", detail: "Patients can understand fit before calling.", scores: { visibility: 4, trust: 18, pricing: 2, retention: 4, authority: 10 } },
      { label: "Basic qualification, clinic address, and phone number", detail: "Functional, but not persuasive.", scores: { visibility: 2, trust: 8, pricing: 0, retention: 0, authority: 3 } },
      { label: "Nothing structured. I explain everything only on call", detail: "Every patient starts cold.", scores: { visibility: 0, trust: 2, pricing: 0, retention: 0, authority: 0 } }
    ]
  },
  {
    id: "pricing",
    eyebrow: "Signal 3 of 7",
    prompt: "A patient asks your consultation fee and compares you with cheaper options. How do you handle it?",
    options: [
      { label: "I explain value, consultation structure, expected care pathway, and quote confidently", detail: "Pricing is connected to clinical clarity.", scores: { visibility: 0, trust: 8, pricing: 20, retention: 4, authority: 7 } },
      { label: "I quote the fee, but I feel pressure to justify or discount", detail: "Value is present, confidence is leaking.", scores: { visibility: 0, trust: 4, pricing: 9, retention: 1, authority: 2 } },
      { label: "I reduce fee quickly because I fear losing the patient", detail: "This protects today and hurts the practice.", scores: { visibility: 0, trust: 1, pricing: 2, retention: 0, authority: 0 } }
    ]
  },
  {
    id: "booking_flow",
    eyebrow: "Signal 4 of 7",
    prompt: "A patient decides to book. How smooth is the journey from interest to appointment?",
    options: [
      { label: "They can call, message, see timings, understand location, and confirm quickly", detail: "Low friction booking flow.", scores: { visibility: 5, trust: 8, pricing: 2, retention: 8, authority: 2 } },
      { label: "They can call, but follow-up depends on manual availability", detail: "Some leads may drop silently.", scores: { visibility: 2, trust: 4, pricing: 0, retention: 4, authority: 1 } },
      { label: "There is no defined booking flow", detail: "Interest is leaking before conversion.", scores: { visibility: 0, trust: 1, pricing: 0, retention: 1, authority: 0 } }
    ]
  },
  {
    id: "patient_education",
    eyebrow: "Signal 5 of 7",
    prompt: "How do you educate patients before or after consultation?",
    options: [
      { label: "I use structured FAQs, condition explainers, pre-visit guidance, and follow-up education", detail: "Education builds trust and recall.", scores: { visibility: 4, trust: 14, pricing: 3, retention: 14, authority: 10 } },
      { label: "I occasionally post or explain manually", detail: "Useful, but inconsistent.", scores: { visibility: 2, trust: 7, pricing: 1, retention: 6, authority: 4 } },
      { label: "I do not have a patient education system", detail: "Expertise is not compounding.", scores: { visibility: 0, trust: 2, pricing: 0, retention: 1, authority: 0 } }
    ]
  },
  {
    id: "reviews",
    eyebrow: "Signal 6 of 7",
    prompt: "How do patient reviews, testimonials, and proof of care currently work?",
    options: [
      { label: "I ethically collect reviews and show proof through patient-safe, compliant formats", detail: "Trust compounds over time.", scores: { visibility: 8, trust: 16, pricing: 2, retention: 5, authority: 8 } },
      { label: "Some reviews exist, but I do not actively manage them", detail: "Proof exists, but it is underused.", scores: { visibility: 4, trust: 8, pricing: 0, retention: 2, authority: 3 } },
      { label: "I avoid asking and have very little visible proof", detail: "Patients have no external confidence signal.", scores: { visibility: 1, trust: 2, pricing: 0, retention: 0, authority: 0 } }
    ]
  },
  {
    id: "authority",
    eyebrow: "Signal 7 of 7",
    prompt: "If someone studies your public presence for 60 seconds, what position do they remember?",
    options: [
      { label: "They can clearly remember my specialty, approach, patient type, and why I am different", detail: "You are becoming a clinician brand.", scores: { visibility: 5, trust: 10, pricing: 8, retention: 3, authority: 20 } },
      { label: "They know I am qualified, but not what makes me distinct", detail: "Competence is visible, positioning is soft.", scores: { visibility: 2, trust: 5, pricing: 3, retention: 1, authority: 8 } },
      { label: "My positioning is not defined yet", detail: "You are present, but not memorable.", scores: { visibility: 0, trust: 2, pricing: 0, retention: 0, authority: 2 } }
    ]
  }
];

const maxScores: Record<Dimension, number> = questions.reduce(
  (acc, question) => {
    const best = question.options.reduce(
      (memo, option) => {
        (Object.keys(option.scores) as Dimension[]).forEach((key) => {
          memo[key] = Math.max(memo[key], option.scores[key]);
        });
        return memo;
      },
      { visibility: 0, trust: 0, pricing: 0, retention: 0, authority: 0 } as Record<Dimension, number>
    );

    (Object.keys(best) as Dimension[]).forEach((key) => {
      acc[key] += best[key];
    });

    return acc;
  },
  { visibility: 0, trust: 0, pricing: 0, retention: 0, authority: 0 } as Record<Dimension, number>
);

const labels: Record<Dimension, string> = {
  visibility: "Local Visibility",
  trust: "Patient Trust",
  pricing: "Pricing Confidence",
  retention: "Patient Retention",
  authority: "Brand Authority"
};

const prescriptions: Record<Dimension, string> = {
  visibility: "Your strongest growth opportunity is becoming easier to discover when nearby patients search for your service.",
  trust: "Your practice needs stronger proof before the patient calls: service clarity, doctor story, FAQs, and visible confidence signals.",
  pricing: "Your clinical value needs a clearer pricing structure so you stop negotiating against yourself.",
  retention: "You need a stronger follow-up and patient education rhythm so patients remember, return, and refer.",
  authority: "Your public positioning needs to become sharper so patients remember what you stand for."
};

const packageFit = [
  { min: 85, name: "Aleph Authority", copy: "You already have a base. The next move is premium positioning, content authority, and scale." },
  { min: 65, name: "Aleph Growth", copy: "You have enough foundation to convert faster with better trust assets, local SEO, and pricing structure." },
  { min: 0, name: "Aleph Starter", copy: "Your priority is a strong digital foundation: profile, website, services, booking clarity, and proof." }
];

function percent(value: number, max: number) {
  return Math.round((value / max) * 100);
}

export default function DiagnosticPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const isComplete = answers.length === questions.length;
  const activeQuestion = questions[step];

  const scores = useMemo(() => {
    const raw: Record<Dimension, number> = { visibility: 0, trust: 0, pricing: 0, retention: 0, authority: 0 };

    answers.forEach((answerIndex, questionIndex) => {
      const selected = questions[questionIndex].options[answerIndex];
      (Object.keys(raw) as Dimension[]).forEach((key) => {
        raw[key] += selected.scores[key];
      });
    });

    const normalized = (Object.keys(raw) as Dimension[]).map((key) => ({
      key,
      label: labels[key],
      score: percent(raw[key], maxScores[key])
    }));

    const overall = Math.round(normalized.reduce((sum, item) => sum + item.score, 0) / normalized.length);
    const weakest = normalized.reduce((low, item) => (item.score < low.score ? item : low), normalized[0]);
    const fit = packageFit.find((item) => overall >= item.min) ?? packageFit[2];

    return { raw, normalized, overall, weakest, fit };
  }, [answers]);

  function chooseOption(index: number) {
    const next = [...answers];
    next[step] = index;
    setAnswers(next.slice(0, step + 1));

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      trackAlephEvent("diagnostic_completed", { questions: questions.length });
    }
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setName("");
    setSpecialty("");
    setEmail("");
    setSubmitState("idle");
    setSubmitMessage("");
  }

  function downloadReport() {
    const lines = [
      "Aleph Practice Growth Report",
      "",
      `Overall readiness: ${scores.overall}%`,
      `Best package fit: ${scores.fit.name}`,
      `Primary growth leak: ${scores.weakest.label}`,
      "",
      "Scorecard",
      ...scores.normalized.map((item) => `- ${item.label}: ${item.score}%`),
      "",
      "30-day focus",
      "1. Fix discovery: Google profile, services, area signals, and appointment path.",
      "2. Build trust: clinician story, FAQs, proof, service pages, and patient objections.",
      "3. Package pricing, patient education, follow-up rhythm, and conversion tracking."
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aleph-practice-growth-report.txt";
    anchor.click();
    URL.revokeObjectURL(url);
    trackAlephEvent("report_downloaded", {
      overall_score: scores.overall,
      weakest_area: scores.weakest.label,
      package_fit: scores.fit.name
    });
  }

  async function saveLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("saving");
    setSubmitMessage("");

    const scoreMap = Object.fromEntries(scores.normalized.map((item) => [item.key, item.score])) as Record<Dimension, number>;

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        specialty,
        overall_score: scores.overall,
        visibility_score: scoreMap.visibility,
        trust_score: scoreMap.trust,
        pricing_score: scoreMap.pricing,
        retention_score: scoreMap.retention,
        authority_score: scoreMap.authority,
        weakest_area: scores.weakest.label,
        package_fit: scores.fit.name
      })
    });

    const result = await response.json();

    if (!response.ok) {
      setSubmitState("error");
      setSubmitMessage(result.error || "Unable to save report.");
      trackAlephEvent("lead_save_failed", { reason: result.error || "unknown" });
      return;
    }

    setSubmitState("saved");
    setSubmitMessage(result.emailSent ? "Report saved and email queued." : "Report saved. Email automation will activate after Resend keys are configured.");
    trackAlephEvent("lead_saved", {
      overall_score: scores.overall,
      weakest_area: scores.weakest.label,
      package_fit: scores.fit.name,
      email_sent: Boolean(result.emailSent)
    });
  }

  if (isComplete) {
    return (
      <main className="min-h-screen bg-ivory px-5 py-10 text-forest">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-forest/70 hover:text-forest">
            <ArrowLeft size={16} /> Back to Aleph
          </Link>

          <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-aleph border border-line bg-forest p-8 text-white shadow-soft">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-gold">Your Practice Growth Report</p>
              <h1 className="mt-5 font-serif text-5xl leading-tight">Your readiness score is {scores.overall}%.</h1>
              <p className="mt-5 text-lg leading-8 text-white/78">{prescriptions[scores.weakest.key]}</p>
              <div className="mt-8 rounded-2xl bg-white/10 p-5">
                <p className="text-sm font-bold text-gold">Best package fit</p>
                <p className="mt-2 text-3xl font-black">{scores.fit.name}</p>
                <p className="mt-3 leading-7 text-white/74">{scores.fit.copy}</p>
              </div>
            </div>

            <div className="rounded-aleph border border-line bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <LineChart className="text-clinic" size={30} />
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-terracotta">Scorecard</p>
                  <h2 className="text-2xl font-black text-forest">Growth leakage by dimension</h2>
                </div>
              </div>

              <div className="mt-7 grid gap-4">
                {scores.normalized.map((item) => (
                  <div key={item.key} className="rounded-2xl bg-mist p-4">
                    <div className="flex items-center justify-between gap-4 text-sm font-black">
                      <span>{item.label}</span>
                      <span>{item.score}%</span>
                    </div>
                    <div className="mt-3 h-3 rounded-full bg-white">
                      <div className="h-3 rounded-full bg-clinic" style={{ width: item.score + "%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-aleph border border-line bg-white p-7 shadow-soft">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="text-gold" size={28} />
                <h2 className="text-2xl font-black">Your next 30-day focus</h2>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-line p-5">
                  <p className="font-black">Week 1</p>
                  <p className="mt-2 text-sm leading-6 text-forest/70">Fix discovery: Google profile, services, area signals, and appointment path.</p>
                </div>
                <div className="rounded-2xl border border-line p-5">
                  <p className="font-black">Week 2</p>
                  <p className="mt-2 text-sm leading-6 text-forest/70">Build trust: clinician story, FAQs, proof, service pages, and patient objections.</p>
                </div>
                <div className="rounded-2xl border border-line p-5">
                  <p className="font-black">Week 3-4</p>
                  <p className="mt-2 text-sm leading-6 text-forest/70">Package pricing, patient education, follow-up rhythm, and conversion tracking.</p>
                </div>
              </div>
            </div>

            <form onSubmit={saveLead} className="rounded-aleph border border-line bg-mist p-7 shadow-soft">
              <div className="flex items-center gap-3">
                <Mail className="text-terracotta" size={26} />
                <h2 className="text-2xl font-black">Save this report</h2>
              </div>
              <p className="mt-3 leading-7 text-forest/70">Save this diagnostic into Aleph admin so the right growth plan can be prepared.</p>
              <label className="mt-5 block text-sm font-bold">Name</label>
              <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 outline-none focus:border-gold" placeholder="Dr. name or clinic owner" />
              <label className="mt-4 block text-sm font-bold">Clinical specialty</label>
              <input value={specialty} onChange={(event) => setSpecialty(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 outline-none focus:border-gold" placeholder="Physiotherapist, dentist, psychologist..." required />
              <label className="mt-4 block text-sm font-bold">Email</label>
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 outline-none focus:border-gold" placeholder="doctor@example.com" required />
              <button disabled={submitState === "saving" || submitState === "saved"} className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-forest px-5 font-black text-white disabled:opacity-60">{submitState === "saving" ? "Saving..." : submitState === "saved" ? "Report Saved" : "Save My Practice Growth Report"}</button>
              {submitMessage ? <p className={"mt-3 text-sm font-bold " + (submitState === "error" ? "text-terracotta" : "text-clinic")}>{submitMessage}</p> : null}
            </form>
          </section>

          <button onClick={reset} className="mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-black text-forest">
            <RotateCcw size={16} /> Retake diagnostic
          </button>
          <button onClick={downloadReport} className="ml-3 mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-black text-forest">
            <Download size={16} /> Download report
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivory px-5 py-10 text-forest">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-forest/70 hover:text-forest">
          <ArrowLeft size={16} /> Back to Aleph
        </Link>

        <section className="mt-8 rounded-aleph border border-line bg-white p-6 shadow-soft md:p-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-terracotta">{activeQuestion.eyebrow}</p>
              <h1 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">Practice Growth Diagnostic</h1>
            </div>
            <div className="rounded-2xl bg-mist px-5 py-4 text-center">
              <p className="text-3xl font-black">{step + 1}/7</p>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-sage">Signals</p>
            </div>
          </div>

          <div className="mt-8 h-2 rounded-full bg-mist">
            <div className="h-2 rounded-full bg-gold transition-all" style={{ width: ((step + 1) / questions.length) * 100 + "%" }} />
          </div>

          <h2 className="mt-10 text-2xl font-black leading-snug md:text-3xl">{activeQuestion.prompt}</h2>

          <div className="mt-7 grid gap-4">
            {activeQuestion.options.map((option, index) => {
              const selected = answers[step] === index;

              return (
                <button
                  key={option.label}
                  onClick={() => chooseOption(index)}
                  className={"group min-h-24 rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-soft " + (selected ? "border-gold bg-gold/12" : "border-line bg-ivory hover:border-gold/60")}
                >
                  <div className="flex items-start gap-4">
                    <span className={"grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black " + (selected ? "bg-gold text-forest" : "bg-white text-forest")}>{String.fromCharCode(65 + index)}</span>
                    <div>
                      <p className="font-black text-forest">{option.label}</p>
                      <p className="mt-2 text-sm leading-6 text-forest/68">{option.detail}</p>
                    </div>
                    {selected ? <CheckCircle2 className="ml-auto shrink-0 text-gold" size={22} /> : <ArrowRight className="ml-auto shrink-0 text-sage opacity-0 transition group-hover:opacity-100" size={20} />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="rounded-full border border-line bg-white px-5 py-3 text-sm font-black text-forest disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <div className="inline-flex items-center gap-2 text-sm font-bold text-forest/60">
              <Sparkles size={16} /> Report builds after final signal
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
