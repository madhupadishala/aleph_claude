"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Pencil,
  RotateCcw,
} from "lucide-react";
import {
  phaseLabels,
  prescriptions,
  questions,
  scoreAnswers,
  type Phase,
} from "@/lib/aleph/diagnostic";
import { GrowthPlan } from "@/components/GrowthPlan";

const phases: Phase[] = [
  "context",
  "acquisition",
  "economics",
  "operations",
  "affordability",
];

const questionNotes: Partial<Record<string, string>> = {
  consultation_time:
    "Aleph does not compare you with one global consultation-time target. Time is interpreted together with specialty context, demand, workflow, staffing, and practice goals.",
  workflow_delegation:
    "The goal is not to shorten clinically necessary care. We look for routine, protocol-based work that trained staff can support without replacing clinical judgment.",
  patient_affordability:
    "This looks at the patient’s total episode-of-care burden — consultation, necessary medicines, diagnostics, and access — not just your consultation fee.",
  capacity:
    "Unused capacity and long waiting lists mean very different things. Aleph uses this answer to separate a demand problem from a capacity problem.",
};

const phaseQuestionIndices = (phase: Phase) =>
  questions
    .map((question, index) => ({ question, index }))
    .filter(({ question }) => question.phase === phase)
    .map(({ index }) => index);

export default function DiagnosticPage() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [reviewPhase, setReviewPhase] = useState<Phase | null>(null);
  const [returnToReview, setReturnToReview] = useState<Phase | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [requestId, setRequestId] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);

  const complete = answers.length === questions.length;
  const result = complete && showReport ? scoreAnswers(answers) : null;
  const currentQuestion =
    !showReport && !reviewPhase && step < questions.length ? questions[step] : null;

  const phaseProgress = useMemo(() => {
    return Object.fromEntries(
      phases.map((phase) => {
        const indices = phaseQuestionIndices(phase);
        const completed = indices.filter((index) => answers[index] !== undefined).length;
        return [phase, { completed, total: indices.length }];
      }),
    ) as Record<Phase, { completed: number; total: number }>;
  }, [answers]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem("aleph-practice-intelligence-v2") ?? "null",
      );
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
        setStep(
          typeof saved.step === "number"
            ? Math.min(saved.step, questions.length)
            : saved.answers.length,
        );
        if (phases.includes(saved.reviewPhase)) setReviewPhase(saved.reviewPhase);
        if (saved.showReport === true && saved.answers.length === questions.length)
          setShowReport(true);
        if (typeof saved.requestId === "string") setRequestId(saved.requestId);
      }
    } catch {
      // A fresh assessment is fine if session storage is unavailable or invalid.
    }
    setRequestId((current) => current || crypto.randomUUID());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(
        "aleph-practice-intelligence-v2",
        JSON.stringify({ answers, step, reviewPhase, showReport, requestId }),
      );
    } catch {
      // Assessment remains usable without persistence.
    }
  }, [answers, step, reviewPhase, showReport, ready, requestId]);

  useEffect(() => {
    if (ready) heading.current?.focus();
  }, [step, reviewPhase, showReport, ready]);

  function answerQuestion(optionIndex: number) {
    if (!currentQuestion) return;

    const updated = [...answers];
    updated[step] = optionIndex;
    setAnswers(updated.slice(0, Math.max(updated.length, step + 1)));
    setState("idle");

    if (returnToReview) {
      setReviewPhase(returnToReview);
      setReturnToReview(null);
      return;
    }

    const nextQuestion = questions[step + 1];
    if (!nextQuestion || nextQuestion.phase !== currentQuestion.phase) {
      setReviewPhase(currentQuestion.phase);
      return;
    }

    setStep(step + 1);
  }

  function previousQuestion() {
    if (step === 0) return;
    setStep(step - 1);
  }

  function editFromReview(index: number, phase: Phase) {
    setStep(index);
    setReviewPhase(null);
    setReturnToReview(phase);
  }

  function finalizePhase(phase: Phase) {
    const phaseIndex = phases.indexOf(phase);
    const isFinalPhase = phaseIndex === phases.length - 1;
    setReviewPhase(null);

    if (isFinalPhase) {
      setStep(questions.length);
      setShowReport(true);
      return;
    }

    const nextPhase = phases[phaseIndex + 1];
    const nextIndex = questions.findIndex((question) => question.phase === nextPhase);
    setStep(nextIndex);
  }

  function reset() {
    setAnswers([]);
    setStep(0);
    setReviewPhase(null);
    setReturnToReview(null);
    setShowReport(false);
    setState("idle");
    setMessage("");
    setRequestId(crypto.randomUUID());
  }

  function download() {
    if (!result) return;
    const text = [
      "Aleph Practice Intelligence Report",
      "",
      `Practice stage: ${result.context.stage}`,
      `Performance: ${result.context.performance}`,
      `Capacity: ${result.context.capacity}`,
      `Typical clinician-facing consultation time: ${result.context.consultationTime}`,
      "",
      ...result.normalized.map((item) => `${item.label}: ${item.score}%`),
      "",
      `Primary constraint: ${result.weakest.label}`,
      prescriptions[result.weakest.key],
      "",
      `Suggested Aleph support: ${result.fit.name}`,
      result.fit.reason,
      "",
      "Operational capacity insight:",
      result.operationalInsight,
      "",
      "Patient affordability insight:",
      result.affordabilityInsight,
      "",
      "This is a practice self-assessment and operating recommendation, not a clinical standard or prediction of patient growth.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aleph-practice-intelligence-report.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "saving" || state === "saved") return;
    setState("saving");
    setMessage("");
    const fields = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(20000),
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
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save your report.");
      setState("saved");
      setMessage("Your practice intelligence report is saved and queued for email.");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "Connection interrupted. Please try again. Your report is still available to download.",
      );
    }
  }

  return (
    <main className="diagnostic-page min-h-[calc(100vh-5rem)]">
      <div className="diagnostic-top">
        <Link href="/" className="text-link">
          <ArrowLeft size={16} />
          Back to Aleph
        </Link>
        <span>PRACTICE INTELLIGENCE</span>
      </div>

      {!ready ? (
        <div role="status" className="mx-auto max-w-3xl px-5 py-16">
          Preparing your practice intelligence assessment...
        </div>
      ) : result ? (
        <div className="report-wrap">
          <header className="report-header">
            <div>
              <p className="eyebrow">YOUR PRACTICE INTELLIGENCE REPORT</p>
              <h1 ref={heading} tabIndex={-1}>
                Understand what is
                <br />
                <em>actually limiting growth.</em>
              </h1>
              <p>{prescriptions[result.weakest.key]}</p>
            </div>
            <div className="score-total">
              <strong>
                {result.overall}
                <span>/100</span>
              </strong>
              <span>Current system maturity</span>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Practice stage", result.context.stage],
              ["Performance", result.context.performance],
              ["Appointment capacity", result.context.capacity],
              ["Typical consultation", result.context.consultationTime],
            ].map(([label, value]) => (
              <article key={label} className="rounded-2xl border border-[#DCE6E1] bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#718078]">
                  {label}
                </p>
                <p className="mt-2 text-base font-semibold leading-6 text-[#123629]">{value}</p>
              </article>
            ))}
          </section>

          <div className="report-grid mt-6">
            <section className="scorecard">
              <p className="eyebrow">SEVEN DIMENSIONS. ONE PRACTICE SYSTEM.</p>
              <h2>Your intelligence scorecard</h2>
              {result.normalized.map((item) => (
                <div className="score-row" key={item.key}>
                  <div>
                    <span>{item.label}</span>
                    <strong>{item.score}%</strong>
                  </div>
                  <meter min={0} max={100} value={item.score} aria-label={item.label} />
                </div>
              ))}
              <p className="small-copy">
                Scores describe the operating system reported in this assessment. They are not clinical quality ratings or revenue forecasts.
              </p>
            </section>

            <aside className="fit-panel">
              <p className="eyebrow">YOUR SUGGESTED ALEPH STARTING POINT</p>
              <h2>{result.fit.name}</h2>
              <p>{result.fit.copy}</p>
              <div className="mt-5 rounded-xl border border-white/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] opacity-70">Why this fit</p>
                <p className="mt-2 text-sm leading-6">{result.fit.reason}</p>
              </div>
              <Link className="button secondary mt-5" href="/pricing">
                Explore this support <ArrowRight size={17} />
              </Link>
              <button type="button" onClick={download} className="text-link">
                <Download size={17} />
                Download report
              </button>
            </aside>
          </div>

          <section className="mt-6 grid gap-5 lg:grid-cols-2">
            <article className="rounded-2xl border border-[#DCE6E1] bg-white p-6">
              <p className="eyebrow">OPERATIONAL CAPACITY</p>
              <h2 className="text-2xl font-semibold text-[#123629]">Protect clinician time without rushing care.</h2>
              <p className="mt-4 leading-7 text-[#52665e]">{result.operationalInsight}</p>
            </article>
            <article className="rounded-2xl border border-[#DCE6E1] bg-white p-6">
              <p className="eyebrow">PATIENT AFFORDABILITY</p>
              <h2 className="text-2xl font-semibold text-[#123629]">Look beyond the consultation fee.</h2>
              <p className="mt-4 leading-7 text-[#52665e]">{result.affordabilityInsight}</p>
            </article>
          </section>

          <section className="mt-6 rounded-2xl bg-[#EDF4F1] p-6 md:p-8">
            <p className="eyebrow">TOP THREE PRIORITIES</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {result.priorities.map((priority, index) => (
                <article key={priority.key} className="rounded-xl bg-white p-5">
                  <span className="text-xs font-bold text-[#C86745]">0{index + 1}</span>
                  <h3 className="mt-3 text-xl font-semibold text-[#123629]">{priority.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#52665e]">{prescriptions[priority.key]}</p>
                </article>
              ))}
            </div>
          </section>

          <GrowthPlan key={result.weakest.key} dimension={result.weakest.key} />

          <div className="save-report">
            <div>
              <p className="eyebrow">KEEP YOUR REPORT</p>
              <h2>Your practice intelligence.<br />Ready when you are.</h2>
              <p>Save a copy and have it emailed to you. Your contact details are only required if you choose to save the report.</p>
              <Link href="/privacy" className="text-link">How we handle your information</Link>
            </div>
            <form onSubmit={save}>
              <label className="field">Name (optional)<input name="name" autoComplete="name" maxLength={120} /></label>
              <label className="field">Clinical specialty<input name="specialty" maxLength={120} minLength={2} placeholder="e.g. General physician" required /></label>
              <label className="field">Email address<input name="email" autoComplete="email" type="email" maxLength={254} required /></label>
              <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
              <label className="consent-line"><input name="reportConsent" type="checkbox" required />I agree to Aleph storing my details and assessment to save and email this report.</label>
              <label className="consent-line"><input name="marketingConsent" type="checkbox" />Also send me the optional educational series. I can unsubscribe anytime.</label>
              <button className="button primary" disabled={state === "saving" || state === "saved"}>
                {state === "saving" ? "Saving your report..." : state === "saved" ? "Report saved" : "Save and email my report"}
                <ArrowRight size={17} />
              </button>
              {message && <p role="status" className={state === "error" ? "form-error" : "form-success"}>{message}</p>}
            </form>
          </div>

          <button type="button" onClick={reset} className="text-link">
            <RotateCcw size={16} />
            Start a fresh assessment
          </button>
        </div>
      ) : reviewPhase ? (
        <section className="mx-auto w-full max-w-3xl px-5 pb-12 pt-6 md:pt-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">{phaseLabels[reviewPhase]}</p>
              <h1 ref={heading} tabIndex={-1} className="mt-1 text-3xl font-semibold text-[#123629] md:text-4xl">
                Review and finalise your answers
              </h1>
            </div>
            <span className="rounded-full bg-[#EDF4F1] px-3 py-1 text-xs font-bold text-[#0F766E]">Segment complete</span>
          </div>

          <div className="grid gap-2">
            {phaseQuestionIndices(reviewPhase).map((index) => {
              const question = questions[index];
              const answer = question.options[answers[index]];
              return (
                <article key={question.id} className="flex items-start justify-between gap-4 rounded-xl border border-[#DCE6E1] bg-white p-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-5 text-[#718078]">{question.prompt}</p>
                    <p className="mt-1 text-sm font-semibold leading-5 text-[#123629]">{answer?.label}</p>
                  </div>
                  <button type="button" onClick={() => editFromReview(index, reviewPhase)} className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#0F766E]">
                    <Pencil size={14} /> Change
                  </button>
                </article>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button type="button" className="text-link" onClick={() => {
              const indices = phaseQuestionIndices(reviewPhase);
              editFromReview(indices[indices.length - 1], reviewPhase);
            }}>
              <ArrowLeft size={15} /> Back
            </button>
            <button type="button" className="button primary" onClick={() => finalizePhase(reviewPhase)}>
              {reviewPhase === phases[phases.length - 1] ? "Finalise and build report" : "Finalise and continue"}
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      ) : currentQuestion ? (
        <section className="mx-auto w-full max-w-3xl px-5 pb-12 pt-4 md:pt-8">
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1" aria-label="Assessment sections">
            {phases.map((phase, index) => {
              const progress = phaseProgress[phase];
              const active = currentQuestion.phase === phase;
              const done = progress.completed === progress.total;
              return (
                <span
                  key={phase}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
                    active
                      ? "bg-[#123629] text-white"
                      : done
                        ? "bg-[#DCE6E1] text-[#123629]"
                        : "bg-[#F6F5F0] text-[#718078]"
                  }`}
                >
                  {done ? <Check className="mr-1 inline" size={12} /> : `${index + 1}. `}
                  {phaseLabels[phase]}
                </span>
              );
            })}
          </div>

          <div className="mb-4 flex items-center justify-between gap-4 text-xs font-semibold text-[#718078]">
            <span>{currentQuestion.eyebrow}</span>
            <span>{step + 1} / {questions.length}</span>
          </div>
          <progress className="mb-7 h-1 w-full" value={step} max={questions.length} aria-label="Practice intelligence progress" />

          <h1 ref={heading} tabIndex={-1} className="max-w-2xl text-2xl font-semibold leading-tight text-[#123629] md:text-3xl">
            {currentQuestion.prompt}
          </h1>

          <div className="mt-5 grid gap-2.5">
            {currentQuestion.options.map((option, index) => (
              <button
                type="button"
                key={option.label}
                onClick={() => answerQuestion(index)}
                className="group flex w-full items-start justify-between gap-4 rounded-xl border border-[#DCE6E1] bg-white p-4 text-left transition hover:border-[#0F766E] hover:bg-[#F8FBFA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
              >
                <span>
                  <strong className="block text-sm font-semibold leading-5 text-[#123629] md:text-base">{option.label}</strong>
                  <small className="mt-1 block text-xs leading-5 text-[#718078]">{option.detail}</small>
                </span>
                <ArrowRight className="mt-1 shrink-0 text-[#8FA69A] transition group-hover:translate-x-0.5 group-hover:text-[#0F766E]" size={18} />
              </button>
            ))}
          </div>

          {questionNotes[currentQuestion.id] && (
            <aside className="mt-4 rounded-lg bg-[#EDF4F1] px-4 py-3 text-xs leading-5 text-[#52665e]">
              <strong className="text-[#123629]">Why we ask: </strong>
              {questionNotes[currentQuestion.id]}
            </aside>
          )}

          <div className="mt-5 flex items-center justify-between">
            <button type="button" className="text-link text-sm" disabled={step === 0} onClick={previousQuestion}>
              <ArrowLeft size={15} /> Previous
            </button>
            <span className="text-xs text-[#8FA69A]">Select an answer to continue automatically</span>
          </div>
        </section>
      ) : null}
    </main>
  );
}
