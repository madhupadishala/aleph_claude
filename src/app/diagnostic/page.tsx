"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Check,
  RotateCcw,
} from "lucide-react";
import { questions, scoreAnswers, prescriptions } from "@/lib/aleph/diagnostic";
import { GrowthPlan } from "@/components/GrowthPlan";

export default function DiagnosticPage() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [requestId, setRequestId] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const complete =
    answers.length === questions.length && step === questions.length;
  useEffect(() => {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem("aleph-diagnostic-v2") ?? "null",
      );
      if (
        Array.isArray(saved?.answers) &&
        saved.answers.length <= 7 &&
        saved.answers.every(
          (n: unknown) =>
            Number.isInteger(n) && Number(n) >= 0 && Number(n) < 3,
        )
      ) {
        setAnswers(saved.answers);
        setStep(saved.answers.length);
        if (typeof saved.requestId === "string") setRequestId(saved.requestId);
      }
    } catch {}
    setRequestId((current) => current || crypto.randomUUID());
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        sessionStorage.setItem(
          "aleph-diagnostic-v2",
          JSON.stringify({ answers, requestId }),
        );
      } catch {}
    }
  }, [answers, ready, requestId]);
  useEffect(() => {
    if (ready) heading.current?.focus();
  }, [step, ready]);
  const result = answers.length === 7 ? scoreAnswers(answers) : null;
  function next() {
    if (choice === null) return;
    const updated = [...answers];
    updated[step] = choice;
    setAnswers(updated.slice(0, step + 1));
    setStep(step + 1);
    setChoice(null);
    setState("idle");
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
      "Aleph Practice Growth Report",
      "",
      ...result.normalized.map((x) => x.label + ": " + x.score + "%"),
      "",
      "Priority: " + result.weakest.label,
      prescriptions[result.weakest.key],
      "Package fit: " + result.fit.name,
      "",
      "Self-assessment based on your answers. Not a prediction of patient growth.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "aleph-growth-report.txt";
    a.click();
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
      if (!response.ok)
        throw new Error(data.error || "Unable to save your report.");
      setState("saved");
      setMessage(
        "Your report is saved and queued for email. If you opted in to the educational series, confirm through the link in your report email.",
      );
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "Connection interrupted. Please try again. Your report is available to download.",
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
        <span>YOUR PRACTICE. YOUR NEXT CHAPTER.</span>
      </div>
      {!ready ? (
        <div role="status" className="page-wrap">
          Preparing your diagnostic...
        </div>
      ) : complete && result ? (
        <div className="report-wrap">
          <header className="report-header">
            <div>
              <p className="eyebrow">YOUR PRACTICE GROWTH REPORT</p>
              <h1 ref={heading} tabIndex={-1}>
                Clarity for your
                <br />
                <em>next chapter.</em>
              </h1>
              <p>{prescriptions[result.weakest.key]}</p>
            </div>
            <div className="score-total">
              <strong>
                {result.overall}
                <span>/100</span>
              </strong>
              <span>Practice readiness</span>
            </div>
          </header>
          <div className="report-grid">
            <section className="scorecard">
              <p className="eyebrow">FIVE DIMENSIONS. ONE CLEARER PICTURE.</p>
              <h2>Your growth scorecard</h2>
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
                A self-assessment based on your answers, not a revenue or
                patient-growth forecast.
              </p>
            </section>
            <aside className="fit-panel">
              <p className="eyebrow">YOUR SUGGESTED STARTING POINT</p>
              <h2>{result.fit.name}</h2>
              <p>{result.fit.copy}</p>
              <Link className="button secondary" href="/pricing">
                Explore this support <ArrowRight size={17} />
              </Link>
              <button onClick={download} className="text-link">
                <Download size={17} />
                Download your report
              </button>
            </aside>
          </div>
          <GrowthPlan key={result.weakest.key} dimension={result.weakest.key} />
          <div className="save-report">
            <div>
              <p className="eyebrow">KEEP YOUR MOMENTUM</p>
              <h2>
                Your report.
                <br />
                Ready when you are.
              </h2>
              <p>
                Save a copy and have it emailed to you. You can also choose five
                short lessons to help put your plan into practice.
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
                  placeholder="e.g. Physiotherapist"
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
                Also send me the optional five-part educational series. I will
                confirm by email and can unsubscribe anytime.
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
          <button onClick={reset} className="text-link">
            <RotateCcw size={16} />
            Start a fresh diagnostic
          </button>
        </div>
      ) : (
        <div className="quiz-layout">
          <aside className="quiz-aside">
            <p className="eyebrow">A MOMENT FOR YOUR PRACTICE</p>
            <h1>
              Where are
              <br />
              you <em>today?</em>
            </h1>
            <p>
              There is no perfect answer. Choose what best reflects your
              practice right now.
            </p>
            <ol>
              {[
                "Local discovery",
                "Patient trust",
                "Pricing confidence",
                "Booking experience",
                "Patient education",
                "Visible credibility",
                "Brand clarity",
              ].map((label, i) => (
                <li
                  key={label}
                  className={i === step ? "active" : i < step ? "done" : ""}
                >
                  <span>{i < step ? <Check size={13} /> : i + 1}</span>
                  {label}
                </li>
              ))}
            </ol>
            <p className="small-copy">
              Your progress stays in this browser session.
            </p>
          </aside>
          <section className="quiz-main">
            <div className="quiz-progress">
              <span>
                QUESTION {step + 1} OF {questions.length}
              </span>
              <span>{Math.round((step / 7) * 100)}% complete</span>
            </div>
            <progress value={step} max={7} aria-label="Diagnostic progress" />
            <h2 ref={heading} tabIndex={-1}>
              {questions[step].prompt}
            </h2>
            <fieldset>
              <legend className="sr-only">
                Choose the answer that best describes your practice
              </legend>
              {questions[step].options.map((option, index) => (
                <label
                  key={option.label}
                  className={
                    "quiz-option " + (choice === index ? "selected" : "")
                  }
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
                className="button secondary"
                disabled={step === 0}
                onClick={() => {
                  setStep(step - 1);
                  setChoice(answers[step - 1] ?? null);
                }}
              >
                Previous
              </button>
              <button
                className="button primary"
                disabled={choice === null}
                onClick={next}
              >
                {step === 6 ? "See my report" : "Continue"}
                <ArrowRight size={17} />
              </button>
            </div>
            <p className="small-copy">
              View and download your results without providing an email.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
