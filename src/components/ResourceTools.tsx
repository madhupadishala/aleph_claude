"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
const checklist = [
  "Clinic name, address and hours are accurate",
  "Services and clinician qualifications are clear",
  "Appointment link and phone number work",
  "Location and accessibility information are available",
  "Common patient questions have clear answers",
];
const script =
  "Thank you for reaching out. We can help you understand whether our services are a good fit. Our consultation fee is [fee] for [duration]. Available appointments are [times]. Would you like details about the first visit or help choosing a time?";
export function ResourceTools() {
  const [cost, setCost] = useState(30000);
  const [income, setIncome] = useState(60000);
  const [slots, setSlots] = useState(120);
  const [occupancy, setOccupancy] = useState(75);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const visits = (slots * occupancy) / 100;
  const fee = visits > 0 ? Math.ceil((cost + income) / visits) : null;
  return (
    <div className="resource-grid">
      <section id="calculator" className="resource-tool">
        <p className="eyebrow">01 / PRICING</p>
        <h2>Your sustainable fee explorer</h2>
        <p>
          Explore the average fee needed to cover costs and your target income.
          This is a planning scenario, before tax, not a fee recommendation.
        </p>
        {[
          ["Monthly practice costs (INR)", cost, setCost, 0, 10000000],
          ["Target monthly income (INR)", income, setIncome, 0, 10000000],
          ["Available appointments per month", slots, setSlots, 1, 2000],
          [
            "Expected appointment occupancy (%)",
            occupancy,
            setOccupancy,
            1,
            100,
          ],
        ].map(([label, value, set, min, max]) => (
          <label className="field" key={label as string}>
            {label as string}
            <input
              type="number"
              min={min as number}
              max={max as number}
              value={value as number}
              onChange={(e) =>
                (set as (n: number) => void)(
                  Math.min(
                    Number(max),
                    Math.max(Number(min), Number(e.target.value)),
                  ),
                )
              }
            />
          </label>
        ))}
        <output className="calculator-result block" aria-live="polite">
          <span className="small-copy">
            ESTIMATED AVERAGE FEE PER APPOINTMENT
          </span>
          <strong>
            {fee === null
              ? "Add appointment capacity"
              : "₹" + fee.toLocaleString("en-IN")}
          </strong>
          <span className="small-copy">
            Based on approximately {Math.round(visits)} appointments each month.
          </span>
        </output>
      </section>
      <div className="grid gap-6">
        <section className="resource-tool">
          <p className="eyebrow">02 / LOCAL VISIBILITY</p>
          <h2>A more discoverable practice</h2>
          {checklist.map((item) => (
            <label
              className="flex min-h-12 items-start gap-3 py-3 text-sm"
              key={item}
            >
              <input
                className="mt-1 h-5 w-5 shrink-0 accent-teal-700"
                type="checkbox"
              />
              {item}
            </label>
          ))}
        </section>
        <section className="resource-tool">
          <p className="eyebrow">03 / BETTER CONVERSATIONS</p>
          <h2>A thoughtful inquiry reply</h2>
          <p>{script}</p>
          <button
            className="button secondary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(script);
                setCopied(true);
                setCopyError(false);
              } catch {
                setCopyError(true);
              }
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
            {copied ? "Copied" : "Copy template"}
          </button>
          {copyError && (
            <p role="status">
              Clipboard is unavailable. Select the text above to copy it.
            </p>
          )}
        </section>
      </div>
      <section className="resource-tool md:col-span-2">
        <p className="eyebrow">04 / YOUR WEBSITE</p>
        <h2>A page patients can understand</h2>
        {[
          [
            "Introduce your practice",
            "State your specialty, qualifications, location and the people you can help. Make the page accurate and specific.",
          ],
          [
            "Explain the first visit",
            "Describe the consultation, duration, fee, what to bring, and how patients can ask questions.",
          ],
          [
            "Make the next step clear",
            "Provide a working booking route, clinic hours, directions, accessibility information and your cancellation policy.",
          ],
        ].map(([title, copy]) => (
          <details key={title}>
            <summary>{title}</summary>
            <p>{copy}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
