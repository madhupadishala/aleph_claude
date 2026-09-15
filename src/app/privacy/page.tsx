import { PageIntro } from "@/components/PageIntro";
export const metadata = {
  title: "Privacy and email choices",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return (
    <main className="page-wrap narrow">
      <PageIntro
        eyebrow="YOUR DATA, YOUR CHOICES"
        title="Privacy, in plain language."
      >
        Aleph is a practice-growth initiative by TheClinixAI. Last updated 15
        September 2026.
      </PageIntro>
      <h2>Using the free tools</h2>
      <p>
        You can view your score and download a report without submitting contact
        details. Answers can be retained in this browser session to recover your
        progress. Checklist progress stays on this device. Please do not enter
        patient information.
      </p>
      <h2>Saving and emailing a report</h2>
      <p>
        When you request a saved report, Aleph stores your name (if provided),
        professional specialty, email, calculated scores and the time and
        version of your consent. Supabase provides storage; Resend handles email
        delivery when these services are configured. Authorized Aleph
        administrators can access submitted reports.
      </p>
      <h2>Educational emails are optional</h2>
      <p>
        The five-part educational sequence requires a separate unchecked opt-in
        and confirmation through a link emailed to you. Every educational email
        contains an unsubscribe link. Unsubscribing cancels pending educational
        messages; a message already being sent may still arrive. Reports you
        explicitly request are separate.
      </p>
      <h2>Security and delivery records</h2>
      <p>
        We keep delivery status, consent and suppression records to honor your
        choices. Rate limits use keyed hashes of network identifiers rather than
        storing raw IP addresses in the application database. Required
        administrator session cookies are used for secure access. We do not use
        advertising cookies or tracking pixels in our email templates.
      </p>
      <h2>Retention and deletion requests</h2>
      <p>
        Contact TheClinixAI using the contact channels on its official website
        to request access, correction or deletion, identifying the email used
        for your report. Minimal suppression records may be retained to avoid
        sending unwanted messages. This release does not automatically delete
        submitted reports on a fixed schedule.
      </p>
      <a className="text-link" href="https://theclinixai.com">
        Contact TheClinixAI
      </a>
    </main>
  );
}
