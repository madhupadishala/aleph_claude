"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
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

export default function DiagnosticPage() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [requestId, setRequestId] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);

  const complete = answers.length === questions.length && step === questions.length;
  const result = complete ? scoreAnswers(answers) : null;
  const currentQuestion = step < questions.length ? questions[step] : null;

  const phaseProgress = useMemo(() => {
    return Object.fromEntries(
      phases.map((phase) => {
        const indices = questions
          .map((question, index) => ({ question, index }))
          .filter(({ question }) => question.phase === phase)
          .map(({ index }) => index);
        const completed = indices.filter((index) => index < answers.length).length;
        return [phase, { completed, total: indices.length }];
      }),
    ) as Record<Phase, { completed: number; total: number }>;
  }, [answers.length]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem("aleph-practice-intelligence-v1") ?? "null",
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
        setStep(saved.answers.length);
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
        "aleph-practice-intelligence-v1",
        JSON.stringify({ answers, requestId }),
      );
    } catch {
      // Assessment remains usable without persistence.
    }
  }, [answers, ready, requestId]);

  useEffect(() => {
    if (ready) heading.current?.focus();
  }, [step, ready]);

  function next() {
    if (choice === null || !currentQuestion) return;
    const updated = [...answers];
    updated[step] = choice;
    setAnswers(updated.slice(0, step + 1));
    setStep(step + 1);
    setChoice(null);
    setState("idle");
  }

  function previous() {
    if (step === 0) return;
    const target = step - 1;
    setStep(target);
    setChoice(answers[target] ?? null);
  }

  function reset() {
    setAnswers([]);
    setStep(0);
    setChoice(null);
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
      setMessage(
        "Your practice intelligence report is saved and queued for email.",
      );
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
    <main className="diagnostic-page">
      <div className="diagnostic-top">
        <Link href="/" className="text-link">
          <ArrowLeft size={16} />
          Back to Aleph
        </Link>
        <span>PRACTICE INTELLIGENCE · NOT A FIXED SCORE QUIZ</span>
      </div>

      {!ready ? (
        <div role="status" className="page-wrap">
          Preparing your practice intelligence assessment...
        </div>
      ) : complete && result ? (
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
              <article
                key={label}
                className="rounded-[1.5rem] border border-[#DCE6E1] bg-white p-5"
              >
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#718078]">
                  {label}
                </p>
                <p className="mt-3 text-lg font-semibold leading-6 text-[#123629]">
                  {value}
                </p>
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
                  <meter
                    min={0}
                    max={100}
                    value={item.score}
                    aria-label={item.label}
                  />
                </div>
              ))}
              <p className="small-copy">
                Scores describe the operating system reported in this assessment.
                They are not clinical quality ratings or revenue forecasts.
              </p>
            </section>

            <aside className="fit-panel">
              <p className="eyebrow">YOUR SUGGESTED ALEPH STARTING POINT</p>
              <h2>{result.fit.name}</h2>
              <p>{result.fit.copy}</p>
              <div className="mt-5 rounded-xl border border-white/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] opacity-70">
                  Why this fit
                </p>
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
            <article className="rounded-[2rem] border border-[#DCE6E1] bg-white p-7">
              <p className="eyebrow">OPERATIONAL CAPACITY</p>
              <h2 className="text-2xl font-semibold text-[#123629]">
                Protect clinician time without rushing care.
              </h2>
              <p className="mt-4 leading-7 text-[#52665e]">
                {result.operationalInsight}
              </p>
            </article>
            <article className="rounded-[2rem] border border-[#DCE6E1] bg-white p-7">
              <p className="eyebrow">PATIENT AFFORDABILITY</p>
              <h2 className="text-2xl font-semibold text-[#123629]">
                Look beyond the consultation fee.
              </h2>
              <p className="mt-4 leading-7 text-[#52665e]">
                {result.affordabilityInsight}
              </p>
            </article>
          </section>

          <section className="mt-6 rounded-[2rem] bg-[#EDF4F1] p-7 md:p-9">
            <p className="eyebrow">TOP THREE PRIORITIES</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {result.priorities.map((priority, index) => (
                <article key={priority.key} className="rounded-2xl bg-white p-5">
                  <span className="text-xs font-bold text-[#C86745]">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-[#123629]">
                    {priority.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#52665e]">
                    {prescriptions[priority.key]}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <GrowthPlan key={result.weakest.key} dimension={result.weakest.key} />

          <div className="save-report">
            <div>
              <p className="eyebrow">KEEP YOUR REPORT</p>
              <h2>
                Your practice intelligence.
                <br />
                Ready when you are.
              </h2>
              <p>
                Save a copy and have it emailed to you. Your contact details are
                only required if you choose to save the report.
              </p>
              <Link href="/privacy" className="text-link">
                How we handle your information
              </Link>
            </div>
            <form onSubmit={save}>
              <label className="field">
                Name (optional)
                <input name="name" autoComplete="name" maxLength={120} />
              </label>
              <label className="field">
                Clinical specialty
                <input
                  name="specialty"
                  maxLength={120}
                  minLength={2}
                  placeholder="e.g. General physician"
                  required
                />
              </label>
              <label className="field">
                Email address
                <input
                  name="email"
                  autoComplete="email"
                  type="email"
                  maxLength={254}
                  required
                />
              </label>
              <div className="honeypot" aria-hidden="true">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <label className="consent-line">
                <input name="reportConsent" type="checkbox" required />I agree
                to Aleph storing my details and assessment to save and email
                this report.
              </label>
              <label className="consent-line">
                <input name="marketingConsent" type="checkbox" />
                Also send me the optional educational series. I can unsubscribe
                anytime.
              </label>
              <button
                className="button primary"
                disabled={state === "saving" || state === "saved"}
              >
                {state === "saving"
                  ? "Saving your report..."
                  : state === "saved"
                    ? "Report saved"
                    : "Save and email my report"}
                <ArrowRight size={17} />
              </button>
              {message && (
                <p
                  role="status"
                  className={state === "error" ? "form-error" : "form-success"}
                >
                  {message}
                </p>
              )}
            </form>
          </div>

          <button type="button" onClick={reset} className="text-link">
            <RotateCcw size={16} />
            Start a fresh assessment
          </button>
        </div>
      ) : currentQuestion ? (
        <div className="quiz-layout">
          <aside className="quiz-aside">
            <p className="eyebrow">ALEPH PRACTICE INTELLIGENCE</p>
            <h1>
              Diagnose the
              <br />
              <em>practice system.</em>
            </h1>
            <p>
              Practice age is not practice health. We look at context, demand,
              capacity, patient experience, operations, and affordability before
              suggesting an Aleph product.
            </p>
            <ol>
              {phases.map((phase, index) => {
                const progress = phaseProgress[phase];
                const active = currentQuestion.phase === phase;
                const done = progress.completed === progress.total;
                return (
                  <li key={phase} className={active ? "active" : done ? "done" : ""}>
                    <span>{done ? <Check size={13} /> : index + 1}</span>
                    {phaseLabels[phase]}
                  </li>
                );
              })}
            </ol>
            <p className="small-copy">
              No patient-identifiable information is requested.
            </p>
          </aside>

          <section className="quiz-main">
            <div className="quiz-progress">
              <span>
                QUESTION {step + 1} OF {questions.length}
              </span>
              <span>{Math.round((step / questions.length) * 100)}% complete</span>
            </div>
            <progress
              value={step}
              max={questions.length}
              aria-label="Practice intelligence progress"
            />
            <p className="eyebrow mt-8">{currentQuestion.eyebrow}</p>
            <h2 ref={heading} tabIndex={-1}>
              {currentQuestion.prompt}
            </h2>
            <fieldset>
              <legend className="sr-only">
                Choose the answer that best describes your practice
              </legend>
              {currentQuestion.options.map((option, index) => (
                <label
                  key={option.label}
                  className={"quiz-option " + (choice === index ? "selected" : "")}
                >
                  <input
                    type="radio"
                    name="answer"
                    checked={choice === index}
                    onChange={() => setChoice(index)}
                  />
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.detail}</small>
                  </span>
                </label>
              ))}
            </fieldset>
            <div className="quiz-controls">
              <button
                type="button"
                className="button secondary"
                disabled={step === 0}
                onClick={previous}
              >
                Previous
              </button>
              <button
                type="button"
                className="button primary"
                disabled={choice === null}
                onClick={next}
              >
                {step === questions.length - 1 ? "Build my intelligence report" : "Continue"}
                <ArrowRight size={17} />
              </button>
            </div>
            <p className="small-copy">
              Aleph does not use one global consultation-time target. Context is
              interpreted together with demand, workflow, and practice goals.
            </p>
          </section>
        </div>
      ) : null}
    </main>
  );
}
