import { buildPracticeReport } from "@/lib/aleph/report";
import type { PracticeLead } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/site";

export const lessons = [
  [
    "Make your practice easier to find",
    "Check your clinic name, address, consultation hours and booking link. Make them consistent wherever patients find you. Start with one accurate profile, then review it every month.",
  ],
  [
    "Help patients understand your approach",
    "Write answers to the five questions patients ask most often. Explain the first appointment, your scope of practice and how to prepare. Keep clinical claims accurate and specific.",
  ],
  [
    "Give your consultation time a sustainable price",
    "List monthly operating costs and the number of appointments you can realistically provide. Use the pricing calculator to explore a sustainable fee. Explain fees clearly before booking.",
  ],
  [
    "Build a considered follow-up routine",
    "Ask patients how and whether they want to hear from your practice. Document their preferences. Make follow-up useful, easy to decline and appropriate to the care being provided.",
  ],
  [
    "Choose one improvement for the next month",
    "Review discovery, inquiries, appointments and repeat visits. Pick the weakest step and one action you can finish this week. Revisit your Aleph diagnostic after a month to reflect on what changed.",
  ],
];
export function emailContent(
  kind: string,
  lesson: number,
  payload: PracticeLead & {
    confirm_token?: string;
    unsubscribe_token?: string;
  },
) {
  if (kind === "report") {
    const report = buildPracticeReport(payload);
    return {
      subject: report.subject,
      text:
        report.plainText +
        (payload.confirm_token
          ? `\n\nYou requested five educational emails. Confirm within 7 days to receive them:\n${siteUrl}/email-preferences?token=${payload.confirm_token}&action=confirm\n\nNo confirmation means no educational sequence.`
          : "") +
        "\n\nThis report is a self-assessment, not a forecast of patient growth.",
    };
  }
  const item = lessons[lesson - 1];
  if (!item || !payload.unsubscribe_token) throw new Error("Invalid email job");
  return {
    subject: `Aleph ${lesson}/5: ${item[0]}`,
    text: `${item[0]}\n\n${item[1]}\n\nYour tools: ${siteUrl}/resources\n\nYou confirmed this five-part sequence from Aleph by TheClinixAI.\nStop these emails: ${siteUrl}/email-preferences?token=${payload.unsubscribe_token}&action=unsubscribe`,
    headers: {
      "List-Unsubscribe": `<${siteUrl}/api/email/preferences?token=${payload.unsubscribe_token}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}
