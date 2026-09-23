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

test("all phases remain contiguous in the question sequence", () => {
  for (const phase of phases) {
    const indexes = indexesFor(phase);
    assert.ok(indexes.length > 0);
    assert.deepEqual(indexes, Array.from({ length: indexes.length }, (_, offset) => indexes[0] + offset));
  }
});
