"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
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

type NumberFieldProps = {
  label: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  min: number;
  max: number;
};

function NumberField({
  label,
  value,
  setValue,
  min,
  max,
}: NumberFieldProps) {
  return (
    <label className="field">
      {label}
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => {
          if (value.trim() === "") {
            setValue(String(min));
            return;
          }

          const parsed = Number(value);
          if (!Number.isFinite(parsed)) {
            setValue(String(min));
            return;
          }

          setValue(String(Math.min(max, Math.max(min, parsed))));
        }}
      />
    </label>
  );
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Some browsers block the Clipboard API even on secure pages.
      // Fall through to the selection-based fallback below.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) throw new Error("Clipboard copy failed");
}

function asNumber(value: string) {
  if (value.trim() === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function ResourceTools() {
  const [cost, setCost] = useState("30000");
  const [income, setIncome] = useState("60000");
  const [slots, setSlots] = useState("120");
  const [occupancy, setOccupancy] = useState("75");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const visits = (asNumber(slots) * asNumber(occupancy)) / 100;
  const fee =
    visits > 0
      ? Math.ceil((asNumber(cost) + asNumber(income)) / visits)
      : null;

  return (
    <div className="resource-grid">
      <section id="calculator" className="resource-tool">
        <p className="eyebrow">01 / PRICING</p>
        <h2>Your sustainable fee explorer</h2>
        <p>
          Explore the average fee needed to cover costs and your target income.
          This is a planning scenario, before tax, not a fee recommendation.
        </p>

        <NumberField
          label="Monthly practice costs (INR)"
          value={cost}
          setValue={setCost}
          min={0}
          max={10000000}
        />
        <NumberField
          label="Target monthly income (INR)"
          value={income}
          setValue={setIncome}
          min={0}
          max={10000000}
        />
        <NumberField
          label="Available appointments per month"
          value={slots}
          setValue={setSlots}
          min={1}
          max={2000}
        />
        <NumberField
          label="Expected appointment occupancy (%)"
          value={occupancy}
          setValue={setOccupancy}
          min={1}
          max={100}
        />

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
            type="button"
            className="button secondary"
            onClick={async () => {
              try {
                await copyToClipboard(script);
                setCopied(true);
                setCopyError(false);
              } catch {
                setCopied(false);
                setCopyError(true);
              }
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} {" "}
            {copied ? "Copied" : "Copy template"}
          </button>
          <p className="sr-only" role="status" aria-live="polite">
            {copied ? "Template copied to clipboard." : ""}
          </p>
          {copyError && (
            <p role="status">
              Clipboard access is unavailable. Select the text above to copy it.
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
