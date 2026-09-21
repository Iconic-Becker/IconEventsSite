/* ═══════════════════════════════════════════════════════════════════════
   Enquiry delivery.

   The site is a static single page app with no server of its own, so the
   form posts to a hosted form endpoint which emails the submission on.

   SETUP (one time)
   1. Create a form at a provider that posts JSON and emails a destination:
      - Web3Forms (web3forms.com): free, no account. Enter
        icon@iconic.events, they email an access key. Endpoint is
        https://api.web3forms.com/submit and the key goes in
        VITE_FORM_ACCESS_KEY.
      - Formspree (formspree.io): create a form addressed to
        icon@iconic.events. Endpoint is https://formspree.io/f/<id> and no
        access key is needed.
   2. Put the values in .env.local (never commit it) and in the host's
      environment variables for the production build:
        VITE_FORM_ENDPOINT=...
        VITE_FORM_ACCESS_KEY=...     # Web3Forms only
   3. Submit the form once and confirm the mail arrives.

   The destination address lives in the provider's settings, not in this
   code, so it cannot be scraped from the published bundle.

   Vite inlines VITE_ variables at build time, so a change needs a rebuild
   and redeploy, not just a restart.
   ═══════════════════════════════════════════════════════════════════════ */

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT
const ACCESS_KEY = import.meta.env.VITE_FORM_ACCESS_KEY

/* Where enquiries are meant to land. Shown in the error state so a visitor
   always has a way to reach us even when the endpoint is down. */
export const ENQUIRY_EMAIL = "icon@iconic.events"

export function isEnquiryConfigured() {
  return Boolean(ENDPOINT)
}

/* Resolves only when the enquiry has actually been accepted. Every other
   path throws, so the caller can never show a success state for a
   submission that went nowhere. */
export async function sendEnquiry({ stage, timing, outcome, email }) {
  if (!ENDPOINT) {
    throw new Error(
      "VITE_FORM_ENDPOINT is not set, so the enquiry was not sent. See src/lib/enquiry.js."
    )
  }

  const payload = {
    ...(ACCESS_KEY ? { access_key: ACCESS_KEY } : {}),
    subject: `New enquiry from ${email}`,
    from_name: "Iconic Events website",
    email,
    replyto: email,
    business_stage: stage,
    timing,
    outcome: outcome.length ? outcome.join(", ") : "Not specified",
    page: typeof window === "undefined" ? "" : window.location.href,
    submitted_at: new Date().toISOString(),
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Enquiry endpoint returned ${response.status}`)
  }

  /* Some providers report a soft failure in a 200 body. */
  const result = await response.json().catch(() => null)
  if (result && result.success === false) {
    throw new Error(result.message || "The enquiry endpoint rejected the submission.")
  }

  return true
}
