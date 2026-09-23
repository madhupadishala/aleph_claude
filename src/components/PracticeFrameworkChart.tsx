const dimensions = [
  {
    label: "Local visibility",
    note: "How easily nearby patients can find the practice.",
    color: "#123629",
  },
  {
    label: "Patient trust",
    note: "How clearly expertise, proof, and fit are communicated.",
    color: "#0F766E",
  },
  {
    label: "Pricing confidence",
    note: "How confidently value, fees, and care pathways are explained.",
    color: "#C59A3D",
  },
  {
    label: "Patient retention",
    note: "How well education, follow-up, and continuity support return visits.",
    color: "#C86745",
  },
  {
    label: "Brand authority",
    note: "How memorable and differentiated the clinician becomes over time.",
    color: "#8FA69A",
  },
];

export function PracticeFrameworkChart() {
  return (
    <section className="rounded-[2rem] border border-[#DCE6E1] bg-white p-6 md:p-10">
      <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="eyebrow">THE ALEPH PRACTICE FRAMEWORK</p>
          <h2 className="mt-3 text-4xl leading-tight md:text-5xl">
            Growth is bigger than marketing.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#41554d]">
            Aleph looks at five dimensions together. Each dimension contributes
            equally to the overall diagnostic score, so one strong area does not
            hide a weak one.
          </p>
        </div>

        <div className="grid items-center gap-8 md:grid-cols-[260px_1fr]">
          <div
            className="relative mx-auto h-[240px] w-[240px] rounded-full md:h-[260px] md:w-[260px]"
            style={{
              background:
                "conic-gradient(#123629 0% 20%, #0F766E 20% 40%, #C59A3D 40% 60%, #C86745 60% 80%, #8FA69A 80% 100%)",
            }}
            role="img"
            aria-label="Pie chart showing five equally weighted Aleph practice dimensions, each contributing twenty percent to the overall score"
          >
            <div className="absolute inset-[24%] flex flex-col items-center justify-center rounded-full bg-[#FBF8F1] text-center">
              <strong className="text-4xl font-semibold text-[#123629]">20%</strong>
              <span className="mt-1 max-w-[100px] text-xs font-semibold uppercase tracking-[0.14em] text-[#52665e]">
                each dimension
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {dimensions.map((dimension) => (
              <div key={dimension.label} className="flex gap-3">
                <span
                  className="mt-1.5 h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: dimension.color }}
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#123629]">
                    {dimension.label}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#607169]">
                    {dimension.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
