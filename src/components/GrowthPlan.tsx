"use client";

import { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";

const actions: Record<string, string[]> = {
  visibility: [
    "Check your clinic name, address and hours across public profiles",
    "Update your services and appointment link",
    "Review how patients found your practice this week",
  ],
  trust: [
    "Explain your consultation process in plain language",
    "Publish answers to five common patient questions",
    "Review your credentials and service information for accuracy",
  ],
  pricing: [
    "Calculate monthly practice costs and available appointments",
    "Write a clear fee and cancellation policy",
    "Review whether your fee supports sustainable consultation time",
  ],
  retention: [
    "Prepare a patient-approved follow-up message",
    "Document consent and communication preferences",
    "Review missed appointments and follow-up completion",
  ],
  authority: [
    "Write a specific statement of your specialty and approach",
    "Draft one educational article in your area of expertise",
    "Review all public claims for accuracy and professional standards",
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
      if (Array.isArray(saved))
        setDone(
          saved.filter(
            (n): n is number => Number.isInteger(n) && n >= 0 && n < 3,
          ),
        );
    } catch {
      /* Storage may be disabled on a shared or private browser. */
    }
    setReady(true);
  }, [dimension]);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(`aleph-plan-${dimension}`, JSON.stringify(done));
      } catch {
        /* Tasks remain usable without persistence. */
      }
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
        `SUMMARY:Aleph practice growth - week ${index + 1}`,
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
            "PRODID:-//Aleph//Growth Plan//EN",
            ...events,
            "END:VCALENDAR",
          ].join("\r\n"),
        ],
        { type: "text/calendar" },
      ),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "aleph-growth-plan.ics";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="mt-6 border-y border-line py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-clinic">YOUR NEXT CHAPTER</p>
          <h2 className="mt-2 text-2xl font-bold">
            Turn your report into progress
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
          onClick={downloadCalendar}
          className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-line bg-white px-4 font-bold"
        >
          <Download size={16} /> Add plan to calendar
        </button>
      </div>
    </section>
  );
}
