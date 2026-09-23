import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { questions, scoreAnswers } from "../src/lib/aleph/diagnostic";
import { readJson, requireSameOrigin } from "../src/lib/security/request";

test("practice intelligence scoring rejects manipulated and incomplete answers", () => {
  const strongest = questions.map(() => 0);
  const weakest = questions.map((question) => question.options.length - 1);

  assert.equal(scoreAnswers(strongest).overall, 100);
  assert.ok(scoreAnswers(weakest).overall < 30);

  for (const input of [
    null,
    [],
    strongest.slice(0, -1),
    strongest.map((answer, index) => (index === 0 ? 99 : answer)),
    strongest.map((answer, index) => (index === 1 ? 0.1 : answer)),
    "100",
  ]) {
    assert.throws(() => scoreAnswers(input));
  }
});

test("established underperforming practice with unused capacity routes to Growth", () => {
  const answers = questions.map(() => 0);
  const set = (id: string, value: number) => {
    const index = questions.findIndex((question) => question.id === id);
    assert.notEqual(index, -1);
    answers[index] = value;
  };

  set("practice_age", 2);
  set("performance", 2);
  set("capacity", 2);
  set("support_preference", 1);

  const result = scoreAnswers(answers);
  assert.equal(result.context.stage, "Established practice (2–5 years)");
  assert.equal(result.context.performance, "Below target");
  assert.equal(result.context.capacity, "Available appointment capacity");
  assert.equal(result.fit.name, "Aleph Growth");
  assert.match(result.fit.copy, /available/i);
});

test("done-for-you preference routes to Concierge independently of practice score", () => {
  const answers = questions.map((question) => question.options.length - 1);
  const supportIndex = questions.findIndex(
    (question) => question.id === "support_preference",
  );
  answers[supportIndex] = 2;
  assert.equal(scoreAnswers(answers).fit.name, "Aleph Concierge");
});

test("request guard rejects malformed, oversized and cross-origin requests", async () => {
  const req = (body: string) =>
    new Request("https://aleph.example/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  await assert.rejects(() => readJson(req("null")));
  await assert.rejects(() => readJson(req("{")));
  await assert.rejects(() =>
    readJson(req(JSON.stringify({ x: "a".repeat(9000) }))),
  );
  assert.throws(() => requireSameOrigin(req("{}")));
});

test("database queue: atomic capture, consent, suppression, retries and rate limiting", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      "create role anon; create role authenticated; create role service_role;",
    );
    for (const file of [
      "001_practice_leads.sql",
      "002_lead_privacy.sql",
      "003_email_operations.sql",
    ])
      await db.exec(readFileSync("supabase/migrations/" + file, "utf8"));
    const lead = {
      name: "Test clinician",
      email: "test@example.invalid",
      specialty: "Physiotherapy",
      overall_score: 100,
      visibility_score: 100,
      trust_score: 100,
      pricing_score: 100,
      retention_score: 100,
      authority_score: 100,
      weakest_area: "Local Visibility",
      package_fit: "Aleph Authority",
    };
    const request = "12345678-1234-4123-8123-123456789abc";
    const capture = () =>
      db.query("select aleph_capture($1::jsonb,$2::uuid,true,'v1') as id", [
        JSON.stringify(lead),
        request,
      ]);
    await capture();
    await capture();
    const count = await db.query<{ count: number }>(
      "select count(*)::int as count from email_jobs",
    );
    assert.equal(count.rows[0].count, 1);
    const sub = await db.query<{ token: string }>(
      "select token from email_subscribers",
    );
    const token = sub.rows[0].token;
    const first = await db.query<{ id: string; lease_token: string }>(
      "select * from aleph_claim_email(null)",
    );
    assert.equal(first.rows.length, 1);
    assert.equal(
      (await db.query("select * from aleph_claim_email(null)")).rows.length,
      0,
    );
    await db.exec(
      "update email_jobs set lease_until=now()-interval '1 minute';",
    );
    const retry = await db.query<{ id: string; lease_token: string }>(
      "select * from aleph_claim_email(null)",
    );
    assert.equal(retry.rows[0].id, first.rows[0].id);
    assert.notEqual(retry.rows[0].lease_token, first.rows[0].lease_token);
    await db.query("select aleph_consent($1,'confirm')", [token]);
    await db.query("select aleph_consent($1,'confirm')", [token]);
    assert.equal(
      (
        await db.query<{ count: number }>(
          "select count(*)::int as count from email_jobs where kind='lesson'",
        )
      ).rows[0].count,
      5,
    );
    await db.query("select aleph_consent($1,'unsubscribe')", [token]);
    assert.equal(
      (
        await db.query<{ count: number }>(
          "select count(*)::int as count from email_jobs where kind='lesson' and status='cancelled'",
        )
      ).rows[0].count,
      5,
    );
    assert.equal(
      (
        await db.query<{ ok: boolean }>(
          "select aleph_consent($1,'confirm') as ok",
          [token],
        )
      ).rows[0].ok,
      false,
    );
    await db.exec(
      "update email_jobs set first_attempt_at=now()-interval '25 hours' where kind='report'",
    );
    await db.query("select * from aleph_claim_email(null)");
    assert.equal(
      (
        await db.query<{ status: string }>(
          "select status from email_jobs where kind='report'",
        )
      ).rows[0].status,
      "review",
    );
    await db.exec(
      "update email_jobs set provider_id='provider-test' where kind='report'",
    );
    await db.query(
      "select aleph_email_event('evt-1','email.complained','provider-test')",
    );
    await db.query(
      "select aleph_email_event('evt-1','email.complained','provider-test')",
    );
    assert.equal(
      (
        await db.query<{ count: number }>(
          "select count(*)::int as count from email_events",
        )
      ).rows[0].count,
      1,
    );
    assert.ok(
      (
        await db.query<{ suppressed_at: string }>(
          "select suppressed_at from email_subscribers",
        )
      ).rows[0].suppressed_at,
    );
    for (let i = 0; i < 4; i++) {
      const r = await db.query<{ ok: boolean }>(
        "select aleph_rate_limit('test',3,60) as ok",
      );
      assert.equal(r.rows[0].ok, i < 3);
    }
    assert.equal(
      (
        await db.query<{ ok: boolean }>(
          "select has_table_privilege('anon','practice_leads','select') as ok",
        )
      ).rows[0].ok,
      false,
    );
    assert.equal(
      (
        await db.query<{ ok: boolean }>(
          "select has_function_privilege('anon','aleph_claim_email(uuid)','execute') as ok",
        )
      ).rows[0].ok,
      false,
    );
  } finally {
    await db.close();
  }
});
