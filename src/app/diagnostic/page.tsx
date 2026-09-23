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
import { buildPracticeIntelligencePdf } from "@/lib/aleph/pdf-report";

const phases: Phase[] = [
  "context",
  "acquisition",
  "economics",
  "operations",
  "affordability",
];

const STORAGE_KEY = "aleph-practice-intelligence-v3";

const questionIndexesFor = (phase: Phase) =>
  questions
    .map((question, index) => ({ question, index }))
    .filter(({ question }) => question.phase === phase)
    .map(({ index }) => index);

function createRequestId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const value = Math.floor(Math.random() * 16);
    const digit = char === "x" ? value : (value & 0x3) | 0x8;
    return digit.toString(16);
  });
}

export default function DiagnosticPage() {
  const [answers, setAnswers] = useState<Array<number | undefined>>([]);
  const [step, setStep] = useState(0);
  const [reviewPhase, setReviewPhase] = useState<Phase | null>(null);
  const [editingFromReview, setEditingFromReview] = useState<Phase | null>(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [requestId, setRequestId] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);

  const allAnswered = questions.every((_, index) => Number.isInteger(answers[index]));
  const completeAnswers = allAnswered ? answers.map(Number) : null;
  const complete = completeAnswers !== null && step === questions.length && !reviewPhase;
  const result = complete && completeAnswers ? scoreAnswers(completeAnswers) : null;
  const currentQuestion = step >= 0 && step < questions.length ? questions[step] : null;
  const currentPhase = currentQuestion?.phase ?? null;

  const phaseProgress = useMemo(() => {
    return Object.fromEntries(
      phases.map((phase) => {
        const indices = questionIndexesFor(phase);
        const completed = indices.filter((index) => Number.isInteger(answers[index])).length;
        return [phase, { completed, total: indices.length }];
      }),
    ) as Record<Phase, { completed: number; total: number }>;
  }, [answers]);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
      if (Array.isArray(saved?.answers) && saved.answers.length <= questions.length) {
        const valid = saved.answers.every((answer: unknown, index: number) => {
          if (answer === null) return true;
          const question = questions[index];
          return (
            !!question &&
            Number.isInteger(answer) &&
            Number(answer) >= 0 &&
            Number(answer) < question.options.length
          );
        });

        if (valid) {
          const restored = saved.answers.map((answer: unknown) =>
            answer === null ? undefined : Number(answer),
          );
          setAnswers(restored);

          const savedStep = Number.isInteger(saved?.step) ? Number(saved.step) : -1;
          if (savedStep >= 0 && savedStep <= questions.length) {
            setStep(savedStep);
          } else {
            const firstMissing = questions.findIndex((_, index) => !Number.isInteger(restored[index]));
            setStep(firstMissing === -1 ? questions.length : firstMissing);
          }
        }
      }
      if (typeof saved?.requestId === "string" && saved.requestId.length > 10) {
        setRequestId(saved.requestId);
      }
    } catch {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    setRequestId((current) => current || createRequestId());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, step, requestId }),
      );
    } catch {}
  }, [answers, step, ready, requestId]);

  useEffect(() => {
    if (ready) heading.current?.focus();
  }, [step, reviewPhase, ready]);

  function movePastPhase(phase: Phase) {
    const phasePosition = phases.indexOf(phase);
    const nextPhase = phases[phasePosition + 1];
    setReviewPhase(null);
    setEditingFromReview(null);
    setStep(nextPhase ? questionIndexesFor(nextPhase)[0] : questions.length);
  }

  function chooseAnswer(optionIndex: number) {
    if (!currentQuestion) return;

    const updated = [...answers];
    updated[step] = optionIndex;
    setAnswers(updated);
    setState("idle");

    if (editingFromReview) {
      const phase = editingFromReview;
      setEditingFromReview(null);
      setReviewPhase(phase);
      return;
    }

    const phaseIndices = questionIndexesFor(currentQuestion.phase);
    const positionInPhase = phaseIndices.indexOf(step);
    const nextInPhase = phaseIndices[positionInPhase + 1];

    if (nextInPhase !== undefined) {
      setStep(nextInPhase);
      return;
    }

    if (phaseIndices.length > 1) {
      setReviewPhase(currentQuestion.phase);
      return;
    }

    movePastPhase(currentQuestion.phase);
  }

  function editQuestion(index: number, phase: Phase) {
    setReviewPhase(null);
    setEditingFromReview(phase);
    setStep(index);
  }

  function previous() {
    if (!currentQuestion || !currentPhase) return;
    setEditingFromReview(null);
    setReviewPhase(null);

    const phaseIndices = questionIndexesFor(currentPhase);
    const positionInPhase = phaseIndices.indexOf(step);
    if (positionInPhase > 0) {
      setStep(phaseIndices[positionInPhase - 1]);
      return;
    }

    const phasePosition = phases.indexOf(currentPhase);
    const previousPhase = phases[phasePosition - 1];
    if (!previousPhase) return;
    const previousIndices = questionIndexesFor(previousPhase);
    setStep(previousIndices[previousIndices.length - 1]);
  }

  function reset() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
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
    const bytes = buildPracticeIntelligencePdf(result);
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aleph-practice-intelligence-report.pdf";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "saving" || state === "saved" || !completeAnswers) return;
    setState("saving");
    setMessage("");
    const fields = new FormData(event.currentTarget);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
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
          answers: completeAnswers,
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
    } finally {
      window.clearTimeout(timeout);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FBF8F1]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="text-link"><ArrowLeft size={16} /> Back to Aleph</Link>
        <span className="hidden text-xs font-bold uppercase tracking-[0.12em] text-[#718078] sm:block">Aleph Practice Intelligence</span>
      </div>

      {!ready ? (
        <div className="mx-auto max-w-3xl px-5 py-16">Preparing your assessment…</div>
      ) : reviewPhase ? (
        <section className="mx-auto w-full max-w-3xl px-5 pb-12 pt-3 md:px-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">Review & finalise</p>
              <h1 ref={heading} tabIndex={-1} className="mt-1 text-3xl font-semibold text-[#123629]">{phaseLabels[reviewPhase]}</h1>
            </div>
            <span className="rounded-full bg-[#EDF4F1] px-3 py-1 text-xs font-bold text-[#123629]">{phases.indexOf(reviewPhase) + 1} / {phases.length}</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#DCE6E1] bg-white">
            {questionIndexesFor(reviewPhase).map((index) => {
              const question = questions[index];
              const selectedIndex = answers[index];
              const selected = Number.isInteger(selectedIndex)
                ? question.options[Number(selectedIndex)]
                : undefined;
              return (
                <div key={question.id} className="flex items-start justify-between gap-4 border-b border-[#EDF4F1] p-4 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#52665e]">{question.prompt}</p>
                    <p className="mt-1 font-semibold text-[#123629]">{selected?.label ?? "Not answered"}</p>
                  </div>
                  <button type="button" onClick={() => editQuestion(index, reviewPhase)} className="shrink-0 rounded-lg border border-[#DCE6E1] p-2 text-[#0F766E]" aria-label={`Edit ${question.prompt}`}>
                    <Pencil size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          <button type="button" onClick={() => movePastPhase(reviewPhase)} className="button primary mt-5 w-full justify-center sm:w-auto">
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

              <div className="mt-6 rounded-2xl border border-[#DCE6E1] p-4 md:p-5">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0F766E]">Practice health profile</p>
                    <h2 className="mt-1 text-lg font-semibold text-[#123629]">Seven diagnostic dimensions</h2>
                  </div>
                  <span className="text-sm font-bold text-[#123629]">{result.overall}/100</span>
                </div>
                <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
                  {result.normalized.map((item) => (
                    <div key={item.key}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                        <span className="font-semibold text-[#52665e]">{item.label}</span>
                        <span className="font-bold text-[#123629]">{item.score}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#EDF4F1]">
                        <div
                          className={`h-full rounded-full ${item.score < 45 ? "bg-[#C86745]" : item.score < 70 ? "bg-[#C59A3D]" : "bg-[#0F766E]"}`}
                          style={{ width: `${Math.max(3, item.score)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {result.priorities.map((priority, index) => (
                  <div key={priority.key} className="flex gap-3 rounded-xl border border-[#DCE6E1] p-4">
                    <span className="font-bold text-[#C86745]">0{index + 1}</span>
                    <div>
                      <strong className="text-[#123629]">{priority.label}</strong>
                      <p className="mt-1 text-sm leading-6 text-[#52665e]">{prescriptions[priority.key]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[1.75rem] bg-[#123629] p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Two key insights</p>
                <p className="mt-4 text-sm leading-6 text-white/85">{result.operationalInsight}</p>
                <p className="mt-4 border-t border-white/15 pt-4 text-sm leading-6 text-white/85">{result.affordabilityInsight}</p>
                <button
                  type="button"
                  onClick={download}
                  className="button mt-5 bg-white text-[#123629] shadow-sm hover:bg-[#EDF4F1]"
                >
                  <Download size={16} /> Download PDF report
                </button>
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
              const done = progress.total > 0 && progress.completed === progress.total;
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

            <h1 ref={heading} tabIndex={-1} className="mt-6 text-2xl font-semibold leading-snug text-[#123629] md:text-3xl">{currentQuestion.prompt}</h1>

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
      ) : (
        <section className="mx-auto max-w-3xl px-5 py-16">
          <p className="text-[#52665e]">We could not restore this assessment safely.</p>
          <button type="button" onClick={reset} className="button primary mt-4">Start a fresh assessment</button>
        </section>
      )}
    </main>
  );
}
