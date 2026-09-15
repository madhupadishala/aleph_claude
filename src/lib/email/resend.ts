import { buildPracticeReport } from "@/lib/aleph/report";
import type { PracticeLead } from "@/lib/supabase/server";

type EmailResult = {
  sent: boolean;
  skipped: boolean;
  error?: string;
};

export async function sendPracticeReportEmail(
  lead: PracticeLead,
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ALEPH_FROM_EMAIL;

  if (!apiKey || !from) {
    return { sent: false, skipped: true };
  }

  const report = buildPracticeReport(lead);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: lead.email,
        subject: report.subject,
        text: report.plainText,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return { sent: false, skipped: false, error: body };
    }

    return { sent: true, skipped: false };
  } catch (error) {
    return {
      sent: false,
      skipped: false,
      error: error instanceof Error ? error.message : "Unknown email error",
    };
  }
}
