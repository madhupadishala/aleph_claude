"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Download, Pencil, RotateCcw } from "lucide-react";
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

  const complete = answers.length === questions.length && step === questions.length && !reviewPhase;
  const result = complete ? scoreAnswers(answers) : null;
  const currentQuestion = step < questions.length ? questions[step] : null;
  const currentPhase = currentQuestion?.phase ?? null;

  const phaseProgress = useMemo(() => {
    return Object.fromEntries(
      phases.map((phase) => {
        const indices = questionIndexesFor(phase);
        const completed = indices.filter((index) => answers[index] !== undefined).length;
        return [phase, { completed, total: indices.length }];
      }),
    ) as Record<Phase, { completed: number; total: number }>;
  }, [answers]);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("aleph-practice-intelligence-v2") ?? "null");
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
      }
      if (typeof saved?.requestId === "string") setRequestId(saved.requestId);
    } catch {}
    setRequestId((current) => current || crypto.randomUUID());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(
        "aleph-practice-intelligence-v2",
        JSON.stringify({ answers, requestId }),
      );
    } catch {}
  }, [answers, ready, requestId]);

  useEffect(() => {
    if (ready) heading.current?.focus();
  }, [step, reviewPhase, ready]);

  function chooseAnswer(optionIndex: number) {
    if (!currentQuestion) return;
    const updated = [...answers];
    updated[step] = optionIndex;
    setAnswers(updated);
    setState("idle");

    if (editingFromReview) {
      const phase = editingFromReview;
      setEditingFromReview(null);
      window.setTimeout(() => setReviewPhase(phase), 140);
      return;
    }

    const phaseIndices = questionIndexesFor(currentQuestion.phase);
    const lastInPhase = phaseIndices[phaseIndices.length - 1] === step;
    window.setTimeout(() => {
      if (lastInPhase) setReviewPhase(currentQuestion.phase);
      else setStep(step + 1);
    }, 140);
  }

  function editQuestion(index: number, phase: Phase) {
    setReviewPhase(null);
    setEditingFromReview(phase);
    setStep(index);
  }

  function finalisePhase(phase: Phase) {
    setReviewPhase(null);
    const phasePosition = phases.indexOf(phase);
    const nextPhase = phases[phasePosition + 1];
    if (!nextPhase) {
      setStep(questions.length);
      return;
    }
    setStep(questionIndexesFor(nextPhase)[0]);
  }

  function previous() {
    if (step === 0) return;
    setEditingFromReview(null);
    setReviewPhase(null);
    setStep(step - 1);
  }

  function reset() {
    setAnswers([]);
    setStep(0);
    setReviewPhase(null);
    setEditingFromReview(null);
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
      setMessage("Your report is saved and queued for email.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to save your report.");
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FBF8F1]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="text-link"><ArrowLeft size={16} /> Back to Aleph</Link>
        <span className="hidden text-xs font-bold uppercase tracking-[0.12em] text-[#718078] sm:block">
          Aleph Practice Intelligence
        </span>
      </div>

      {!ready ? (
        <div className="mx-auto max-w-3xl px-5 py-16">Preparing your assessment…</div>
      ) : reviewPhase ? (
        <section className="mx-auto w-full max-w-3xl px-5 pb-12 pt-3 md:px-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">Review & finalise</p>
              <h1 ref={heading} tabIndex={-1} className="mt-1 text-3xl font-semibold text-[#123629]">
                {phaseLabels[reviewPhase]}
              </h1>
            </div>
            <span className="rounded-full bg-[#EDF4F1] px-3 py-1 text-xs font-bold text-[#123629]">
              {phases.indexOf(reviewPhase) + 1} / {phases.length}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#DCE6E1] bg-white">
            {questionIndexesFor(reviewPhase).map((index) => {
              const question = questions[index];
              const selected = question.options[answers[index]];
              return (
                <div key={question.id} className="flex items-start justify-between gap-4 border-b border-[#EDF4F1] p-4 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#52665e]">{question.prompt}</p>
                    <p className="mt-1 font-semibold text-[#123629]">{selected?.label}</p>
                  </div>
                  <button type="button" onClick={() => editQuestion(index, reviewPhase)} className="shrink-0 rounded-lg border border-[#DCE6E1] p-2 text-[#0F766E]" aria-label={`Edit ${question.prompt}`}>
                    <Pencil size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          <button type="button" onClick={() => finalisePhase(reviewPhase)} className="button primary mt-5 w-full justify-center sm:w-auto">
            Finalise & continue <ArrowRight size={17} />
          </button>
        </section>
      ) : complete && result ? (
        <section className="mx-auto w-full max-w-5xl px-5 pb-14 pt-3 md:px-8">
          <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <div className="rounded-[1.75rem] bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">Your practice intelligence</p>
              <h1 ref={heading} tabIndex={-1} className="mt-2 text-4xl font-semibold leading-tight text-[#123629]">{result.fit.name}</h1>
              <p className="mt-3 max-w-2xl leading-7 text-[#52665e]">{result.fit.copy}</p>
              <p className="mt-4 rounded-xl bg-[#EDF4F1] p-4 text-sm leading-6 text-[#123629]">{result.fit.reason}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Stage", result.context.stage],
                  ["Performance", result.context.performance],
                  ["Capacity", result.context.capacity],
                  ["Consultation", result.context.consultationTime],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-[#DCE6E1] p-3">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-[#718078]">{label}</span>
                    <p className="mt-1 text-sm font-semibold text-[#123629]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {result.priorities.map((priority, index) => (
                  <div key={priority.key} className="flex gap-3 rounded-xl border border-[#DCE6E1] p-4">
                    <span className="font-bold text-[#C86745]">0{index + 1}</span>
                    <div><strong className="text-[#123629]">{priority.label}</strong><p className="mt-1 text-sm leading-6 text-[#52665e]">{prescriptions[priority.key]}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[1.75rem] bg-[#123629] p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Two key insights</p>
                <p className="mt-4 text-sm leading-6 text-white/85">{result.operationalInsight}</p>
                <p className="mt-4 border-t border-white/15 pt-4 text-sm leading-6 text-white/85">{result.affordabilityInsight}</p>
                <button type="button" onClick={download} className="button secondary mt-5"><Download size={16} /> Download report</button>
              </div>

              <details className="rounded-[1.5rem] border border-[#DCE6E1] bg-white p-5">
                <summary className="cursor-pointer font-semibold text-[#123629]">Email me this report</summary>
                <form onSubmit={save} className="mt-4 space-y-3">
                  <input className="w-full rounded-lg border border-[#DCE6E1] p-3" name="name" placeholder="Name (optional)" maxLength={120} />
                  <input className="w-full rounded-lg border border-[#DCE6E1] p-3" name="specialty" placeholder="Clinical specialty" minLength={2} maxLength={120} required />
                  <input className="w-full rounded-lg border border-[#DCE6E1] p-3" name="email" type="email" placeholder="Email" required />
                  <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
                  <label className="flex gap-2 text-xs text-[#52665e]"><input name="reportConsent" type="checkbox" required /> Save my assessment and email this report.</label>
                  <label className="flex gap-2 text-xs text-[#52665e]"><input name="marketingConsent" type="checkbox" /> Send optional Aleph educational updates.</label>
                  <button className="button primary w-full justify-center" disabled={state === "saving" || state === "saved"}>{state === "saving" ? "Saving…" : state === "saved" ? "Report saved" : "Email my report"}</button>
                  {message && <p className="text-xs" role="status">{message}</p>}
                </form>
              </details>

              <button type="button" onClick={reset} className="text-link"><RotateCcw size={16} /> Start again</button>
            </aside>
          </div>
        </section>
      ) : currentQuestion ? (
        <section className="mx-auto w-full max-w-3xl px-5 pb-10 pt-1 md:px-8">
          <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
            {phases.map((phase, index) => {
              const progress = phaseProgress[phase];
              const active = currentPhase === phase;
              const done = progress.completed === progress.total;
              return (
                <div key={phase} className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${active ? "bg-[#123629] text-white" : done ? "bg-[#EDF4F1] text-[#0F766E]" : "bg-white text-[#718078]"}`}>
                  {done ? <Check size={13} /> : index + 1} {phaseLabels[phase]}
                </div>
              );
            })}
          </div>

          <div className="rounded-[1.75rem] border border-[#DCE6E1] bg-white p-5 shadow-sm md:p-7">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">{currentQuestion.eyebrow}</span>
              <span className="text-xs font-semibold text-[#718078]">{step + 1}/{questions.length}</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EDF4F1]"><div className="h-full bg-[#0F766E]" style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>

            <h1 ref={heading} tabIndex={-1} className="mt-6 text-2xl font-semibold leading-snug text-[#123629] md:text-3xl">
              {currentQuestion.prompt}
            </h1>

            <div className="mt-5 grid gap-2.5">
              {currentQuestion.options.map((option, index) => {
                const selected = answers[step] === index;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => chooseAnswer(index)}
                    className={`w-full rounded-xl border p-4 text-left transition ${selected ? "border-[#0F766E] bg-[#EDF4F1]" : "border-[#DCE6E1] bg-white hover:border-[#8FA69A] hover:bg-[#FDFCF9]"}`}
                  >
                    <span className="block font-semibold leading-5 text-[#123629]">{option.label}</span>
                    {option.detail && <span className="mt-1 block text-sm leading-5 text-[#66766f]">{option.detail}</span>}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#EDF4F1] pt-4">
              <button type="button" onClick={previous} disabled={step === 0} className="text-link disabled:opacity-30"><ArrowLeft size={15} /> Previous</button>
              <p className="text-right text-xs leading-5 text-[#718078]">Select an answer to continue automatically.</p>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
