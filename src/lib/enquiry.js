/* ═══════════════════════════════════════════════════════════════════════
   Enquiry delivery.

   The site is a static single page app with no server of its own, so the
   form posts to a hosted form endpoint which emails the submission on.

   Live setup: Web3Forms, delivering to contact@iconic.events. The
   destination address lives in the Web3Forms account rather than in this
   code, so it is not scrapeable from the published bundle.

   To point somewhere else, set VITE_FORM_ENDPOINT and VITE_FORM_ACCESS_KEY.
   Formspree also works: its endpoint is https://formspree.io/f/<id> and it
   ignores the access key. Vite inlines VITE_ variables at build time, so a
   change needs a rebuild and redeploy, not just a restart.
   ═══════════════════════════════════════════════════════════════════════ */

/* Web3Forms, delivering to contact@iconic.events.

   The access key is public by design: Vite inlines it into the bundle, so it
   is readable in the published page source whatever we do here. It is not a
   credential, and it only permits delivery to the address registered with it.
   Keeping it in code means a deploy needs no host configuration to work.

   Both values can still be overridden by environment variables, which is how
   you would point a staging build at a different inbox. */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || "https://api.web3forms.com/submit"
const ACCESS_KEY =
  import.meta.env.VITE_FORM_ACCESS_KEY || "0b889357-65be-468f-9d77-4980a85abfec"

/* Shown in the error state so a visitor always has a way to reach us even
   when the endpoint is down. Same role account as the footer. */
export { CONTACT_EMAIL as ENQUIRY_EMAIL } from "./contact.js"

export function isEnquiryConfigured() {
  return Boolean(ENDPOINT && (ACCESS_KEY || !ENDPOINT.includes("web3forms")))
}

/* Resolves only when the enquiry has actually been accepted. Every other
   path throws, so the caller can never show a success state for a
   submission that went nowhere. */
export async function sendEnquiry({ stage, timing, outcome, email }) {
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

/* Vendor sign-ups go to the same inbox through the same endpoint, with a
   subject that makes them sortable away from client enquiries. Same contract
   as sendEnquiry: it resolves only once the endpoint has accepted, so the
   caller can never show a confirmation for something that went nowhere. */
export async function sendVendorApplication(vendor) {
  const payload = {
    ...(ACCESS_KEY ? { access_key: ACCESS_KEY } : {}),
    subject: `Vendor sign-up: ${vendor.company || vendor.name}`,
    from_name: "Iconic Events vendor sign-up",
    email: vendor.email,
    replyto: vendor.email,
    company: vendor.company,
    contact_name: vendor.name,
    phone: vendor.phone || "Not given",
    website: vendor.website || "Not given",
    disciplines: vendor.disciplines.length ? vendor.disciplines.join(", ") : "Not specified",
    coverage: vendor.coverage || "Not given",
    insured: vendor.insured ? "Yes" : "Not stated",
    notes: vendor.notes || "",
    page: typeof window === "undefined" ? "" : window.location.href,
    submitted_at: new Date().toISOString(),
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Vendor endpoint returned ${response.status}`)
  }

  const result = await response.json().catch(() => null)
  if (result && result.success === false) {
    throw new Error(result.message || "The endpoint rejected the sign-up.")
  }

  return true
}
