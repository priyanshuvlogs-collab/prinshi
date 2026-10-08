import "server-only";
import { site } from "@/lib/site";

interface Mail {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** Marketing emails must carry an unsubscribe link; transactional ones may omit it. */
  unsubscribeUrl?: string;
}

/**
 * Sends email through Resend when RESEND_API_KEY is set.
 * Otherwise logs the message to the server console so the flow can be tested locally.
 */
export async function sendEmail(mail: Mail): Promise<{ ok: boolean; id?: string }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? `${site.name} <onboarding@resend.dev>`;
  if (!key) {
    console.info(`[email:dev] to=${mail.to} subject="${mail.subject}"\n${mail.text}`);
    return { ok: true };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      headers: mail.unsubscribeUrl
        ? {
            "List-Unsubscribe": `<${mail.unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          }
        : undefined,
    }),
  });
  if (!res.ok) {
    console.error("[email] Resend error", res.status, await res.text());
    return { ok: false };
  }
  const data = (await res.json()) as { id?: string };
  return { ok: true, id: data.id };
}

export function confirmEmail(opts: { productName: string; confirmUrl: string; unsubscribeUrl: string }) {
  const text = [
    `Confirm your email to hear about ${opts.productName}.`,
    "",
    `Open this link to confirm: ${opts.confirmUrl}`,
    "",
    "If you did not sign up, ignore this email and nothing will be sent.",
    `Unsubscribe at any time: ${opts.unsubscribeUrl}`,
    "",
    `${site.name}. ${site.originLine}`,
  ].join("\n");
  const html = `
<p>Confirm your email to hear about <strong>${esc(opts.productName)}</strong>.</p>
<p><a href="${opts.confirmUrl}" style="display:inline-block;padding:12px 20px;background:#0E0E0E;color:#F4F1EA;text-decoration:none;font-weight:700">Confirm my email</a></p>
<p>If you did not sign up, ignore this email and nothing will be sent.</p>
<p style="color:#666;font-size:13px"><a href="${opts.unsubscribeUrl}">Unsubscribe</a> &middot; ${esc(site.name)}. ${esc(site.originLine)}</p>`;
  return { subject: `Confirm your email for ${opts.productName}`, text, html };
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
