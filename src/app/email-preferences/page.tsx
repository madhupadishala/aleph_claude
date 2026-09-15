import type { Metadata } from "next";
import Link from "next/link";
import { uuidPattern } from "@/lib/site";
export const metadata: Metadata = {
  title: "Email preferences",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export default async function Preferences({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const valid =
    typeof query.token === "string" &&
    uuidPattern.test(query.token) &&
    (query.action === "confirm" || query.action === "unsubscribe");
  const result =
    query.result === "confirmed" || query.result === "unsubscribed";
  return (
    <main className="page-wrap narrow">
      <p className="eyebrow">YOU ARE IN CONTROL</p>
      <h1>
        {result
          ? query.result === "confirmed"
            ? "You are on the list."
            : "Follow-ups stopped."
          : "Email preferences"}
      </h1>
      <p className="page-intro">
        {result
          ? "Your email preference has been updated. You can continue using all free Aleph tools."
          : valid
            ? query.action === "confirm"
              ? "Confirm that you would like five practice-growth emails from Aleph. You can unsubscribe at any time."
              : "Stop the educational sequence. A report you explicitly request can still be emailed to you."
            : "Open the preference link in an email from Aleph."}
      </p>
      {valid && (
        <form method="post" action="/api/email/preferences">
          <input type="hidden" name="token" value={query.token as string} />
          <input type="hidden" name="action" value={query.action as string} />
          <button className="button primary">
            {query.action === "confirm"
              ? "Confirm my subscription"
              : "Unsubscribe"}
          </button>
        </form>
      )}
      <Link className="text-link" href="/resources">
        Explore free resources
      </Link>
    </main>
  );
}
