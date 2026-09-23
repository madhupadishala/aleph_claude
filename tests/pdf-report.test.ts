import { test } from "node:test";
import assert from "node:assert/strict";
import { questions, scoreAnswers } from "../src/lib/aleph/diagnostic";
import { buildPracticeIntelligencePdf } from "../src/lib/aleph/pdf-report";

test("Practice Intelligence report exports a two-page PDF with assessment content", () => {
  const answers = questions.map(() => 0);
  const result = scoreAnswers(answers);
  const pdf = buildPracticeIntelligencePdf(result, new Date("2026-09-23T00:00:00.000Z"));
  const text = new TextDecoder().decode(pdf);

  assert.ok(pdf.length > 7000);
  assert.ok(text.startsWith("%PDF-1.4"));
  assert.match(text, /\/Type \/Pages/);
  assert.match(text, /\/Count 2/);
  assert.match(text, /Practice Intelligence Report/i);
  assert.match(text, /Practice health profile/i);
  assert.match(text, /Recommended Aleph pathway/i);
  assert.ok(text.endsWith("%%EOF"));
});
