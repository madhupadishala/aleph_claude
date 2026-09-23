import { test } from "node:test";
import assert from "node:assert/strict";
import { phaseLabels, questions, type Phase } from "../src/lib/aleph/diagnostic";

const phases: Phase[] = ["context", "acquisition", "economics", "operations", "affordability"];

const indexesFor = (phase: Phase) =>
  questions
    .map((question, index) => ({ question, index }))
    .filter(({ question }) => question.phase === phase)
    .map(({ index }) => index);

test("only multi-question diagnostic segments require review", () => {
  const requiringReview = phases.filter((phase) => indexesFor(phase).length > 1);
  assert.deepEqual(requiringReview, ["context", "acquisition"]);

  for (const phase of ["economics", "operations", "affordability"] as Phase[]) {
    assert.equal(indexesFor(phase).length, 1, `${phaseLabels[phase]} should auto-finalise`);
  }
});

test("segment navigation is based on phase membership, not array adjacency", () => {
  const acquisition = indexesFor("acquisition");
  const economics = indexesFor("economics");

  assert.equal(acquisition.length, 4);
  assert.equal(economics.length, 1);
  assert.ok(
    acquisition.some((index, position) =>
      position > 0 && index - acquisition[position - 1] > 1,
    ),
    "patient acquisition questions are intentionally not all adjacent in the source array",
  );
});
