"use client";

import { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";

const actions: Record<string, string[]> = {
  visibility: [
    "Check your clinic name, address, hours, services, and booking route across public profiles",
    "Strengthen the service pages or profile information patients see before they call",
    "Track how every new patient found the practice for one week",
  ],
  trust: [
    "Explain your consultation process in plain language before the patient books",
    "Publish answers to five common patient questions",
    "Review credentials, proof, service information, and next steps for clarity",
  ],
  pricing: [
    "Separate sustainable practice economics from reactive discounting",
    "Write a clear consultation fee, cancellation, and follow-up policy",
    "Review whether patients understand the value and structure before price comparison begins",
  ],
  retention: [
    "Map the journey from booking to reminder to follow-up",
    "Create a patient-approved follow-up and education rhythm",
    "Review missed appointments, incomplete follow-ups, and where patients drop away",
  ],
  authority: [
    "Write one specific statement describing what the practice is known for",
    "Create one useful educational asset around a common patient question",
    "Review public messaging so specialty, approach, and differentiation are memorable and accurate",
  ],
  operations: [
    "List routine non-diagnostic tasks that currently consume clinician time before and after consultations",
    "Review which standardized tasks trained staff can handle under clinic protocols without replacing clinical judgment",
    "Measure one week of clinician time saved, patient waiting, and any tasks that still need escalation",
  ],
  affordability: [
    "Map the patient-facing cost of common care journeys: consultation, necessary medicines, diagnostics, and travel/convenience",
    "Review transparent lower-cost options where clinically appropriate, including patient-facing diagnostic tariffs rather than referral commissions",
    "Ask five patients whether any part of the care journey created an unexpected cost or access problem",
  ],
};

export function GrowthPlan({ dimension }: { dimension: string }) {
  const tasks = actions[dimension] ?? actions.visibility;
  const [done, setDone] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(`aleph-plan-${dimension}`) ?? "[]",
      );
      if (Array.isArray(saved)) {
        setDone(
          saved.filter(
            (n): n is number => Number.isInteger(n) && n >= 0 && n < 3,
          ),
        );
      }
    } catch {
      // Storage may be disabled on a shared or private browser.
    }
    setReady(true);
  }, [dimension]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(`aleph-plan-${dimension}`, JSON.stringify(done));
    } catch {
      // Tasks remain usable without persistence.
    }
  }, [done, dimension, ready]);

  function downloadCalendar() {
    const stamp = (date: Date) =>
      date.toISOString().slice(0, 10).replaceAll("-", "");
    const events = tasks.map((task, index) => {
      const start = new Date();
      start.setDate(start.getDate() + 1 + index * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      return [
        "BEGIN:VEVENT",
        `UID:${crypto.randomUUID()}@aleph`,
        `DTSTAMP:${new Date()
          .toISOString()
          .replace(/[-:]/g, "")
          .replace(/\.\d{3}/, "")}`,
        `DTSTART;VALUE=DATE:${stamp(start)}`,
        `DTEND;VALUE=DATE:${stamp(end)}`,
        `SUMMARY:Aleph practice intelligence - week ${index + 1}`,
        `DESCRIPTION:${task}`,
        "END:VEVENT",
      ].join("\r\n");
    });
    const url = URL.createObjectURL(
      new Blob(
        [
          [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Aleph//Practice Intelligence Plan//EN",
            ...events,
            "END:VCALENDAR",
          ].join("\r\n"),
        ],
        { type: "text/calendar" },
      ),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "aleph-practice-plan.ics";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="mt-6 border-y border-line py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-clinic">YOUR NEXT THREE MOVES</p>
          <h2 className="mt-2 text-2xl font-bold">
            Turn diagnosis into measurable action
          </h2>
        </div>
        <span role="status" className="text-sm font-bold">
          {done.length} of 3 complete
        </span>
      </div>
      <div className="mt-5 grid gap-3">
        {tasks.map((task, index) => (
          <label
            key={task}
            className="flex min-h-16 cursor-pointer items-center gap-4 rounded-lg border border-line bg-white p-4"
          >
            <input
              type="checkbox"
              checked={done.includes(index)}
              onChange={() =>
                setDone((current) =>
                  current.includes(index)
                    ? current.filter((n) => n !== index)
                    : [...current, index],
                )
              }
              className="h-5 w-5 shrink-0 accent-teal-700"
            />
            <span className="flex-1">
              <span className="block text-xs font-bold text-clinic">
                WEEK {index + 1}
              </span>
              <span
                className={
                  done.includes(index)
                    ? "text-forest/60 line-through"
                    : "text-forest"
                }
              >
                {task}
              </span>
            </span>
            {done.includes(index) && <Check size={18} aria-hidden="true" />}
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-forest/70">
          Checklist saved on this device. No patient information needed.
        </p>
        <button
          type="button"
          onClick={downloadCalendar}
          className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-line bg-white px-4 font-bold"
        >
          <Download size={16} /> Add plan to calendar
        </button>
      </div>
    </section>
  );
}
