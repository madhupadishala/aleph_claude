"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download, Pencil, RotateCcw } from "lucide-react";
import {
  phaseLabels,
  prescriptions,
  questions,
  scoreAnswers,
  type Phase,
} from "@/lib/aleph/diagnostic";

const phases: Phase[] = [
  "context",
  "acquisition",
  "economics",
  "operations",
  "affordability",
];

const questionIndexesFor = (phase: Phase) =>
  questions
    .map((question, index) => ({ question, index }))
    .filter(({ question }) => question.phase === phase)
    .map(({ index }) => index);

const phaseQuestionCounts = Object.fromEntries(
  phases.map((phase) => [phase, questionIndexesFor(phase).length]),
) as Record<Phase, number>;

const questionNotes: Partial<Record<string, string>> = {
  practice_age:
    "Practice age tells us maturity, not whether the practice is performing well.",
  performance:
    "Your own target is the reference point here — not a generic industry target.",
  capacity:
    "This helps Aleph separate a demand problem from a capacity problem.",
  support_preference:
    "This affects whether Aleph should recommend guidance, supported execution, or managed support.",
  consultation_time:
    "Aleph does not use one global consultation-time target. Time is interpreted with demand, workflow, staffing, and practice goals.",
  workflow_delegation:
    "The aim is to remove avoidable repetition while keeping clinical decisions with the clinician.",
  patient_affordability:
    "Aleph looks at total patient cost — consultation, necessary medicines, diagnostics, and access — not consultation fee alone.",
};

function createRequestId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // Fallback below.
  }
  return `aleph-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function firstQuestionOfNextPhase(phase: Phase) {
  const phaseIndex = phases.indexOf(phase);
  const next = phases[phaseIndex + 1];
  return next ? questionIndexesFor(next)[0] : questions.length;
}

export default function DiagnosticPage() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [reviewPhase, setReviewPhase] = useState<Phase | null>(null);
  const [editingFromReview, setEditingFromReview] = useState<Phase | null>(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [requestId, setRequestId] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);

  const currentQuestion = step < questions.length ? questions[step] : null;
  const currentPhase = currentQuestion?.phase ?? null;
  const complete =
    ready &&
    !reviewPhase &&
    step === questions.length &&
    answers.length === questions.length;

  const result = complete ? scoreAnswers(answers) : null;

  const currentPhasePosition = useMemo(() => {
    if (!currentPhase) return -1;
    const indices = questionIndexesFor(currentPhase);
    return indices.indexOf(step);
  }, [currentPhase, step]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("aleph-practice-intelligence-v3");
      const saved = raw ? JSON.parse(raw) : null;
      if (
        Array.isArray(saved?.answers) &&
        saved.answers.length <= questions.length &&
        saved.answers.every(
          (answer: unknown, index: number) =>
            Number.isInteger(answer) &&
            Number(answer) >= 0 &&
            Number(answer) < questions[index].options.length,
        )
      ) {
        setAnswers(saved.answers);
        setStep(Math.min(saved.answers.length, questions.length));
      }
      if (typeof saved?.requestId === "string" && saved.requestId) {
        setRequestId(saved.requestId);
      }
    } catch {
      // Start fresh if storage is unavailable or stale.
    }
    setRequestId((current) => current || createRequestId());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(
        "aleph-practice-intelligence-v3",
        JSON.stringify({ answers, requestId }),
      );
    } catch {
      // Assessment remains usable without storage.
    }
  }, [answers, ready, requestId]);

  useEffect(() => {
    if (ready) heading.current?.focus();
  }, [step, reviewPhase, ready]);

  function chooseAnswer(optionIndex: number) {
    if (!currentQuestion) return;

    const updated = answers.slice();
    updated[step] = optionIndex;
    setAnswers(updated);
    setState("idle");

    if (editingFromReview) {
      const phase = editingFromReview;
      setEditingFromReview(null);
      setReviewPhase(phase);
      return;
    }

    const indices = questionIndexesFor(currentQuestion.phase);
    const isLastQuestionInPhase = indices[indices.length - 1] === step;

    if (!isLastQuestionInPhase) {
      setStep(step + 1);
      return;
    }

    if (indices.length > 1) {
      setReviewPhase(currentQuestion.phase);
      return;
    }

    setStep(firstQuestionOfNextPhase(currentQuestion.phase));
  }

  function editQuestion(index: number, phase: Phase) {
    setReviewPhase(null);
    setEditingFromReview(phase);
    setStep(index);
  }

  function finalisePhase(phase: Phase) {
    setReviewPhase(null);
    setEditingFromReview(null);
    setStep(firstQuestionOfNextPhase(phase));
  }

  function previous() {
    if (step === 0) return;
    setReviewPhase(null);
    setEditingFromReview(null);
    setStep(step - 1);
  }

  function reset() {
    setAnswers([]);
    setStep(0);
    setReviewPhase(null);
    setEditingFromReview(null);
    setState("idle");
    setMessage("");
    setRequestId(createRequestId());
  }

  function download() {
    if (!result) return;
    const text = [
      "Aleph Practice Intelligence Report",
      "",
      `Practice stage: ${result.context.stage}`,
      `Performance: ${result.context.performance}`,
      `Capacity: ${result.context.capacity}`,
      `Typical consultation: ${result.context.consultationTime}`,
      "",
      ...result.normalized.map((item) => `${item.label}: ${item.score}%`),
      "",
      `Primary constraint: ${result.weakest.label}`,
      prescriptions[result.weakest.key],
      "",
      `Suggested Aleph support: ${result.fit.name}`,
      result.fit.reason,
      "",
      result.operationalInsight,
      result.affordabilityInsight,
    ].join("\n");

    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aleph-practice-intelligence-report.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "saving" || state === "saved") return;
    setState("saving");
    setMessage("");
    const fields = new FormData(event.currentTarget);

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 20000);
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          name: fields.get("name"),
          email: fields.get("email"),
          specialty: fields.get("specialty"),
          website: fields.get("website"),
          reportConsent: fields.get("reportConsent") === "on",
          marketingConsent: fields.get("marketingConsent") === "on",
          answers,
          requestId,
        }),
      });
      window.clearTimeout(timeout);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save your report.");
      setState("saved");
      setMessage("Your report is saved and queued for email.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to save your report.");
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FBF8F1]">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" className="text-link">
          <ArrowLeft size={16} /> Back to Aleph
        </Link>
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#718078]">
          Practice Intelligence
        </span>
      </div>

      {!ready ? (
        <div className="mx-auto max-w-3xl px-5 py-12">Preparing your assessment…</div>
      ) : reviewPhase ? (
        <section className="mx-auto w-full max-w-3xl px-5 pb-10 pt-2 md:px-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0F766E]">
                Review & finalise
              </p>
              <h1 ref={heading} tabIndex={-1} className="mt-1 text-2xl font-semibold text-[#123629]">
                {phaseLabels[reviewPhase]}
              </h1>
            </div>
            <span className="text-xs font-semibold text-[#718078]">
              Segment {phases.indexOf(reviewPhase) + 1} of {phases.length}
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#DCE6E1] bg-white">
            {questionIndexesFor(reviewPhase).map((index) => {
              const question = questions[index];
              const selected = question.options[answers[index]];
              return (
                <div
                  key={question.id}
                  className="flex items-start justify-between gap-3 border-b border-[#EDF4F1] px-4 py-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-xs leading-5 text-[#718078]">{question.prompt}</p>
                    <p className="mt-0.5 text-sm font-semibold text-[#123629]">{selected?.label}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => editQuestion(index, reviewPhase)}
                    className="shrink-0 rounded-lg border border-[#DCE6E1] p-2 text-[#0F766E]"
                    aria-label={`Edit ${question.prompt}`}
                  >
                    <Pencil size={15} />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => finalisePhase(reviewPhase)}
            className="button primary mt-4 w-full justify-center sm:w-auto"
          >
            Finalise & continue <ArrowRight size={16} />
          </button>
        </section>
      ) : complete && result ? (
        <section className="mx-auto w-full max-w-5xl px-5 pb-12 pt-2 md:px-8">
          <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm md:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0F766E]">
                Your practice intelligence
              </p>
              <h1 ref={heading} tabIndex={-1} className="mt-1 text-3xl font-semibold text-[#123629]">
                {result.fit.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#52665e]">{result.fit.copy}</p>
              <p className="mt-3 rounded-xl bg-[#EDF4F1] p-3 text-sm leading-6 text-[#123629]">
                {result.fit.reason}
              </p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Stage", result.context.stage],
                  ["Performance", result.context.performance],
                  ["Capacity", result.context.capacity],
                  ["Consultation", result.context.consultationTime],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-[#DCE6E1] p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#718078]">{label}</span>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[#123629]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {result.priorities.map((priority, index) => (
                  <div key={priority.key} className="flex gap-3 rounded-lg border border-[#DCE6E1] p-3">
                    <span className="text-sm font-bold text-[#C86745]">0{index + 1}</span>
                    <div>
                      <strong className="text-sm text-[#123629]">{priority.label}</strong>
                      <p className="mt-0.5 text-xs leading-5 text-[#52665e]">{prescriptions[priority.key]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-3">
              <div className="rounded-[1.5rem] bg-[#123629] p-5 text-white">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">Key insights</p>
                <p className="mt-3 text-xs leading-5 text-white/85">{result.operationalInsight}</p>
                <p className="mt-3 border-t border-white/15 pt-3 text-xs leading-5 text-white/85">
                  {result.affordabilityInsight}
                </p>
                <button type="button" onClick={download} className="button secondary mt-4">
                  <Download size={15} /> Download report
                </button>
              </div>

              <details className="rounded-[1.25rem] border border-[#DCE6E1] bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-[#123629]">Email me this report</summary>
                <form onSubmit={save} className="mt-3 space-y-2">
                  <input className="w-full rounded-lg border border-[#DCE6E1] p-2.5 text-sm" name="name" placeholder="Name (optional)" maxLength={120} />
                  <input className="w-full rounded-lg border border-[#DCE6E1] p-2.5 text-sm" name="specialty" placeholder="Clinical specialty" minLength={2} maxLength={120} required />
                  <input className="w-full rounded-lg border border-[#DCE6E1] p-2.5 text-sm" name="email" type="email" placeholder="Email" maxLength={254} required />
                  <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
                  <label className="flex gap-2 text-[11px] leading-4 text-[#52665e]">
                    <input name="reportConsent" type="checkbox" required /> Save my assessment and email this report.
                  </label>
                  <label className="flex gap-2 text-[11px] leading-4 text-[#52665e]">
                    <input name="marketingConsent" type="checkbox" /> Send optional Aleph educational updates.
                  </label>
                  <button className="button primary w-full justify-center" disabled={state === "saving" || state === "saved"}>
                    {state === "saving" ? "Saving…" : state === "saved" ? "Report saved" : "Email my report"}
                  </button>
                  {message && <p className="text-xs" role="status">{message}</p>}
                </form>
              </details>

              <button type="button" onClick={reset} className="text-link">
                <RotateCcw size={15} /> Start again
              </button>
            </aside>
          </div>
        </section>
      ) : currentQuestion && currentPhase ? (
        <section className="mx-auto w-full max-w-3xl px-5 pb-8 pt-1 md:px-8">
          <div className="mb-3 flex items-center justify-between gap-4 text-xs text-[#718078]">
            <span className="font-semibold text-[#123629]">{phaseLabels[currentPhase]}</span>
            <span>
              {currentPhasePosition + 1} of {phaseQuestionCounts[currentPhase]} · Segment {phases.indexOf(currentPhase) + 1}/{phases.length}
            </span>
          </div>

          <div className="mb-4 grid grid-cols-5 gap-1" aria-label="Assessment segment progress">
            {phases.map((phase, index) => (
              <div
                key={phase}
                className={`h-1.5 rounded-full ${index <= phases.indexOf(currentPhase) ? "bg-[#0F766E]" : "bg-[#DCE6E1]"}`}
              />
            ))}
          </div>

          <div className="rounded-[1.25rem] border border-[#DCE6E1] bg-white p-4 shadow-sm md:p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0F766E]">{currentQuestion.eyebrow}</p>
            <h1 ref={heading} tabIndex={-1} className="mt-2 text-2xl font-semibold leading-tight text-[#123629] md:text-3xl">
              {currentQuestion.prompt}
            </h1>

            {questionNotes[currentQuestion.id] && (
              <p className="mt-2 rounded-lg bg-[#EDF4F1] px-3 py-2 text-xs leading-5 text-[#52665e]">
                {questionNotes[currentQuestion.id]}
              </p>
            )}

            <div className="mt-4 grid gap-2">
              {currentQuestion.options.map((option, index) => {
                const selected = answers[step] === index;
                return (
                  <button
                    type="button"
                    key={option.label}
                    onClick={() => chooseAnswer(index)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                      selected
                        ? "border-[#0F766E] bg-[#EDF4F1]"
                        : "border-[#DCE6E1] bg-white hover:border-[#8FA69A] hover:bg-[#FDFCF9]"
                    }`}
                  >
                    <span className="block text-sm font-semibold leading-5 text-[#123629]">{option.label}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-[#718078]">{option.detail}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#EDF4F1] pt-3">
              <button type="button" onClick={previous} disabled={step === 0} className="text-link disabled:opacity-30">
                <ArrowLeft size={15} /> Previous
              </button>
              <span className="text-[11px] text-[#718078]">Select an answer to continue automatically</span>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-3xl px-5 py-12">
          <p className="text-sm text-[#52665e]">Unable to resume this assessment.</p>
          <button type="button" onClick={reset} className="button primary mt-4">Start again</button>
        </section>
      )}
    </main>
  );
}
