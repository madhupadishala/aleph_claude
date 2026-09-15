const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createSession, verifySession, passwordsMatch, SESSION_SECONDS } = require("../.test-build/session.js");

test("signed sessions never contain the password", () => {
  const secret = "test-secret-not-for-production";
  const token = createSession(secret, 1000);
  assert.equal(token.includes(secret), false);
  assert.equal(verifySession(token, secret, 1000), true);
  assert.equal(verifySession(token, "wrong", 1000), false);
  assert.equal(verifySession(token, secret, 1000 + SESSION_SECONDS * 1000), false);
});
test("tampering and legacy password cookies fail closed", () => {
  const token = createSession("secret", 1000);
  assert.equal(verifySession(token + "x", "secret", 1000), false);
  assert.equal(verifySession("secret", "secret"), false);
  assert.equal(verifySession(undefined, "secret"), false);
  assert.equal(verifySession(token, undefined), false);
});
test("password comparison rejects invalid input", () => {
  assert.equal(passwordsMatch("secret", "secret"), true);
  for (const value of [null, {}, 42, "wrong", "x".repeat(1025)]) assert.equal(passwordsMatch(value, "secret"), false);
});
