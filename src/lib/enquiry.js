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

/* Addresses that say nothing about the company behind them. Flagged in the
   email, never blocked: plenty of founders run on gmail. */
const FREE_MAIL = /@(gmail|googlemail|yahoo|hotmail|outlook|live|icloud|me|mac|aol|proton|protonmail|gmx|msn)\./i

/* Phrases that read like someone selling to us rather than buying. A flag
   in the email for a person to judge, never a reason to drop the enquiry. */
const SALES_PITCH = /\b(our (services|agency|team|platform|solution)|we (help|offer|provide|specialize|specialise)|partner(ship)? opportunit|lead gen|appointment setting|seo|outsourc|white.?label|book (a|your) (call|demo)|quick call)\b/i

function flags(freeMail, pitch) {
  return [
    freeMail && "Personal email address, not a company domain",
    pitch && "Reads like a sales pitch. They skipped the partner form",
  ].filter(Boolean).join(". ")
}

/* Where the visitor came from: the utm_source if the link carried one,
   else the referring site, else direct. */
function trafficSource() {
  if (typeof window === "undefined") return ""
  const utm = new URLSearchParams(window.location.search).get("utm_source")
  if (utm) return utm
  try {
    const ref = document.referrer && new URL(document.referrer).hostname
    if (ref && ref !== window.location.hostname) return ref
  } catch {
    /* an unparseable referrer is no source at all */
  }
  return "Direct"
}

/* The studio works on Miami time, so the inbox reads in it. */
function miamiTime(date) {
  return date.toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  })
}

/* The one place anything leaves this file.

   Resolves only when the endpoint has accepted the submission. A network
   failure, an HTTP error and a JSON body carrying success:false all throw,
   so no caller can show a confirmation for something that went nowhere.

   Both forms were sending their own copy of this. sendEnquiry's copy went
   missing in a rewrite and the client form threw ReferenceError on every
   submit, which is why there is now exactly one. */
async function post(payload) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Form endpoint returned ${response.status}`)
  }

  const result = await response.json().catch(() => null)
  if (result && result.success === false) {
    throw new Error(result.message || "The endpoint rejected the submission.")
  }

  return true
}

/* Resolves only when the enquiry has actually been accepted. Every other
   path throws, so the caller can never show a success state for a
   submission that went nowhere. */
export async function sendEnquiry({ name, email, company, event, guests, budget, timing, notes }) {
  const budgetLine = budget === "I don't know yet" ? "Budget not set" : budget
  const flagged = flags(FREE_MAIL.test(email), SALES_PITCH.test(notes))
  /* The subject carries the triage, so leads can be sorted from the inbox
     list without opening one. */
  const payload = {
    ...(ACCESS_KEY ? { access_key: ACCESS_KEY } : {}),
    subject: `${flagged ? "[Check] " : ""}${budgetLine} · ${guests} guests · ${timing} · ${name}, ${company}`,
    from_name: "Iconic Events website",
    name,
    email,
    ...(flagged ? { flags: flagged } : {}),
    replyto: email,
    company,
    event,
    guests,
    budget,
    timing,
    anything_else: notes.trim() || "Nothing added",
    source: trafficSource(),
    page: typeof window === "undefined" ? "" : window.location.href,
    submitted: miamiTime(new Date()),
  }

  return post(payload)
}

/* A vendor, venue or agency offering a service. Same inbox, but its own
   sender name and a [Partner] subject, so one mail rule files it away from
   client enquiries. */
/* Everyone selling to us comes through here: vendors, venues, agencies,
   speakers, software. Same inbox as a client enquiry, with a [Partner]
   subject so these sort away from briefs.

   Same contract as sendEnquiry: it resolves only once the endpoint has
   accepted, so a sign-up that went nowhere can never show a confirmation. */
export async function sendPartner({ name, email, company, phone, website, coverage, categories, insured, notes }) {
  const payload = {
    ...(ACCESS_KEY ? { access_key: ACCESS_KEY } : {}),
    subject: `[Partner] ${categories?.length ? categories[0] : "General"} · ${company || name}`,
    from_name: "Iconic Events partner sign-up",
    email,
    replyto: email,
    contact_name: name,
    company: company || "Not given",
    phone: phone || "Not given",
    website: website || "Not given",
    offers: categories?.length ? categories.join(", ") : "Not specified",
    coverage: coverage || "Not given",
    insured: insured ? "Yes" : "Not stated",
    notes: notes || "",
    page: typeof window === "undefined" ? "" : window.location.href,
    submitted_at: new Date().toISOString(),
  }

  return post(payload)
}
