"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { Calculator, Check, Copy } from "lucide-react";

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

function NumberField({ label, value, setValue, min, max }: NumberFieldProps) {
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
      // Fall through for browsers that block Clipboard API access.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
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
    <section className="mt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">QUICK UTILITIES</p>
          <h2 className="text-3xl font-semibold text-[#123629]">
            Use only what you need.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-[#607169]">
          These are simple utilities, not the Aleph intelligence engine. Your
          product recommendation comes from the Practice Intelligence assessment.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <article className="resource-tool">
          <p className="eyebrow">01 / FEE PLANNER</p>
          <h2>Financial sustainability calculator</h2>
          <p>
            A simple planning equation for practice costs and capacity. It is not
            a market-pricing or clinical recommendation.
          </p>
          <div className="mt-5 rounded-xl bg-[#EDF4F1] p-4">
            <span className="small-copy">CURRENT SCENARIO</span>
            <strong className="mt-1 block text-2xl text-[#123629]">
              {fee === null ? "Add capacity" : `₹${fee.toLocaleString("en-IN")}`}
            </strong>
            <span className="small-copy">average fee per filled appointment</span>
          </div>
          <details className="mt-4">
            <summary className="flex cursor-pointer items-center gap-2 font-semibold text-[#0F766E]">
              <Calculator size={17} /> Open planner
            </summary>
            <div className="pt-2">
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
                label="Expected occupancy (%)"
                value={occupancy}
                setValue={setOccupancy}
                min={1}
                max={100}
              />
              <p className="small-copy">
                Based on approximately {Math.round(visits)} filled appointments
                each month, before tax and other personal financial factors.
              </p>
            </div>
          </details>
        </article>

        <article className="resource-tool">
          <p className="eyebrow">02 / VISIBILITY CHECK</p>
          <h2>Can patients understand the practice?</h2>
          <div className="mt-3">
            {checklist.map((item) => (
              <label
                className="flex min-h-11 items-start gap-3 border-b border-[#EDF4F1] py-2.5 text-sm last:border-0"
                key={item}
              >
                <input
                  className="mt-1 h-4 w-4 shrink-0 accent-teal-700"
                  type="checkbox"
                />
                {item}
              </label>
            ))}
          </div>
        </article>

        <article className="resource-tool">
          <p className="eyebrow">03 / INQUIRY REPLY</p>
          <h2>A clearer first response</h2>
          <p>{script}</p>
          <button
            type="button"
            className="button secondary mt-4"
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
        </article>
      </div>

      <article className="resource-tool mt-5">
        <p className="eyebrow">04 / WEBSITE CLARITY</p>
        <h2>A page patients can understand</h2>
        <div className="grid gap-x-8 md:grid-cols-3">
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
        </div>
      </article>
    </section>
  );
}
