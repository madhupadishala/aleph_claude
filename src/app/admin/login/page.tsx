"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      setSaving(false);

      if (!response.ok) {
        setError("Password is not matching.");
        return;
      }

      router.push("/admin/leads");
      router.refresh();
    } catch {
      setError("Connection interrupted. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ivory px-5 text-forest">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-aleph border border-line bg-white p-8 shadow-soft"
      >
        <div className="flex items-center gap-3">
          <LockKeyhole className="text-terracotta" size={30} />
          <h1 className="font-serif text-5xl">Aleph Admin</h1>
        </div>
        <p className="mt-4 leading-7 text-forest/70">
          Enter the admin password configured in Vercel.
        </p>
        <label
          htmlFor="admin-password"
          className="mt-6 block text-sm font-black"
        >
          Password
        </label>
        <input
          id="admin-password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          className="mt-2 min-h-12 w-full rounded-xl border border-line bg-ivory px-4 outline-none focus:border-gold"
          required
        />
        {error ? (
          <p role="alert" className="mt-3 text-sm font-bold text-terracotta">
            {error}
          </p>
        ) : null}
        <button
          disabled={saving}
          className="mt-6 min-h-12 w-full rounded-full bg-forest px-5 font-black text-white disabled:opacity-60"
        >
          {saving ? "Checking..." : "Unlock Leads"}
        </button>
      </form>
    </main>
  );
}
