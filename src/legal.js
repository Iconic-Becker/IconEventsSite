/* ═══════════════════════════════════════════════════════════════════════
   LEGAL PAGES: /privacy and /terms.

   Drafted 2026-10-05 from what the site actually does, so it can be kept
   true. If any of these change, change the policy with them:

   - Enquiry form (Cta.jsx): name, work email, company or website, event
     type, guest count, budget range, timing, notes, plus the traffic
     source (utm_source or referring site). Delivered by Web3Forms to
     contact@iconic.events.
   - Vendor form (Vendors.jsx): company, name, email, phone, website,
     coverage, categories, insurance status, notes. Same delivery.
   - Google Tag Manager, container GTM-PS4743JW. Whatever it loads (Meta
     Pixel, Google Analytics) is covered under "Cookies and advertising".
     The Meta paragraph follows the disclosure Meta's Business Tools Terms
     ask advertisers to make; keep it while Meta tags run.
   - Video embeds on case studies: YouTube (privacy enhanced) and Vimeo.
   - Hosting: Railway.

   Not legal advice. Have counsel review before relying on it, in
   particular the governing law (Florida, assumed from the Miami base).

   Body items render in order: a string is a paragraph, { list: [...] } is a
   bulleted list. Inside either, an array mixes text with links written as
   { a: "label", href: "..." }.
   ═══════════════════════════════════════════════════════════════════════ */

const EMAIL = "contact@iconic.events"
const PHONE = "(305) 791-5290"
const UPDATED = "October 5, 2026"

const mail = { a: EMAIL, href: `mailto:${EMAIL}` }

export const PRIVACY = {
  path: "/privacy",
  eyebrow: "Legal",
  title: "Privacy Policy",
  description:
    "How Iconic Events collects, uses and protects personal information, including our use of cookies, the Meta Pixel and advertising tools.",
  updated: UPDATED,
  intro: [
    "Iconic Events LLC (\"Iconic Events\", \"we\", \"us\") produces live events. This policy explains what personal information we collect when you visit iconic.events, contact us, respond to one of our ads or work with us, how we use it, who we share it with, and the choices you have.",
  ],
  sections: [
    {
      id: "collect",
      heading: "Information we collect",
      body: [
        "Information you give us. When you send an enquiry, sign up as a vendor, fill in a lead form on Facebook or Instagram, or write to us directly, we collect what you provide. That can include:",
        {
          list: [
            "Your name, email address, phone number, company name and website.",
            "Details about your event, such as the type of event, guest numbers, budget range, timing and any notes you add.",
            "For vendors, the services you offer, the areas you cover and whether you carry insurance.",
            "Anything else you choose to tell us in a message, call or meeting.",
          ],
        },
        "Information collected automatically. When you visit the site, we and our partners collect technical information through cookies, pixels and similar technologies. That can include your IP address, browser and device type, the pages you view, how you arrived (for example the ad or website that sent you), and actions you take, such as submitting a form.",
        "Information from others. When you respond to one of our ads, the advertising platform (such as Meta) may share with us the information you submit in its lead form and reports about how our ads perform.",
      ],
    },
    {
      id: "use",
      heading: "How we use it",
      body: [
        {
          list: [
            "To reply to your enquiry, prepare proposals and plan and deliver events.",
            "To manage our relationships with vendors and partners.",
            "To send you information about our services that you have asked for, or that relates to an enquiry you made. You can opt out at any time.",
            "To measure and improve our website and our advertising, including showing our ads to people who have visited the site or who are likely to be interested in our work.",
            "To keep the site secure, prevent spam and abuse, and meet our legal obligations.",
          ],
        },
        "We do not sell your personal information for money.",
      ],
    },
    {
      id: "cookies",
      heading: "Cookies and advertising",
      body: [
        "We use Google Tag Manager to load tools that help us understand and improve the site and our advertising. These may include Google Analytics and the Meta Pixel.",
        [
          "Meta. We use the Meta Pixel and related Meta Business Tools. Third parties, including Meta, may use cookies, web beacons and other storage technologies to collect or receive information from our website and elsewhere on the internet, and use that information to provide measurement services and target ads. Meta's use of this information is governed by its own policy, available at ",
          { a: "facebook.com/privacy/policy", href: "https://www.facebook.com/privacy/policy" },
          ". You can control the ads you see on Facebook and Instagram in your ",
          { a: "Meta ad preferences", href: "https://www.facebook.com/adpreferences" },
          ".",
        ],
        [
          "Google. Google Analytics uses cookies to report how the site is used. You can opt out with the ",
          { a: "Google Analytics opt-out add-on", href: "https://tools.google.com/dlpage/gaoptout" },
          " and manage Google ad personalization in ",
          { a: "My Ad Center", href: "https://myadcenter.google.com" },
          ".",
        ],
        [
          "Opting out of interest-based ads. You can opt out of interest-based advertising from participating companies at ",
          { a: "aboutads.info/choices", href: "https://www.aboutads.info/choices" },
          " (United States), ",
          { a: "youradchoices.ca", href: "https://youradchoices.ca/choices" },
          " (Canada) and ",
          { a: "youronlinechoices.eu", href: "https://www.youronlinechoices.eu" },
          " (Europe). You can also block or delete cookies in your browser settings; parts of the site may then work differently.",
        ],
        "Video. Case study pages embed videos from YouTube, using its privacy enhanced mode, and Vimeo. These services may set their own cookies when you play a video.",
      ],
    },
    {
      id: "share",
      heading: "Who we share it with",
      body: [
        "We share personal information only as needed to run our business:",
        {
          list: [
            "Service providers who work on our behalf, such as our website host, the service that delivers form submissions to our inbox, email and file storage providers, and analytics and advertising platforms.",
            "Vendors and venues we engage to produce your event, limited to what they need to do their part.",
            "Advertising partners such as Meta and Google, as described above.",
            "Authorities or other parties where the law requires it, or to protect our rights, our clients or the public.",
            "A buyer or successor if our business is sold or reorganized, under the same protections.",
          ],
        },
      ],
    },
    {
      id: "retention",
      heading: "How long we keep it",
      body: [
        "We keep enquiry and client information for as long as we are in contact or working together, and afterwards for as long as we reasonably need it for records, legal, tax or accounting purposes. We delete or anonymize information we no longer need.",
      ],
    },
    {
      id: "rights",
      heading: "Your choices and rights",
      body: [
        "You can ask us to tell you what personal information we hold about you, to correct it, to delete it, or to stop using it for marketing. Depending on where you live, you may have further rights, such as the right to opt out of targeted advertising or of the sharing of your information for that purpose, and the right not to be treated differently for using your rights.",
        ["To make a request, email ", mail, ` or call ${PHONE}. We will confirm your request and respond within the time the law allows. We may need to verify your identity first.`],
        "Unsubscribe links in our marketing emails also stop those emails straight away.",
      ],
    },
    {
      id: "security",
      heading: "Security",
      body: [
        "We use reasonable measures to protect personal information, including encrypted connections to the site. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
      ],
    },
    {
      id: "children",
      heading: "Children",
      body: [
        "Our services are for businesses and adults. We do not knowingly collect personal information from children under 16. If you believe a child has given us information, contact us and we will delete it.",
      ],
    },
    {
      id: "international",
      heading: "International visitors",
      body: [
        "We are based in the United States, and the information we collect is processed and stored in the United States and in other countries where our service providers operate. Where we produce events abroad, information may be shared with local vendors and venues as needed.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      body: [
        "We may update this policy from time to time. The date at the top shows when it last changed. Significant changes will be highlighted on this page.",
      ],
    },
    {
      id: "contact",
      heading: "Contact us",
      body: [
        ["Iconic Events LLC. Email ", mail, ` or call ${PHONE}.`],
      ],
    },
  ],
}

export const TERMS = {
  path: "/terms",
  eyebrow: "Legal",
  title: "Terms and Conditions",
  description:
    "The terms that govern your use of the Iconic Events website, including intellectual property, disclaimers and limitations of liability.",
  updated: UPDATED,
  intro: [
    "These terms govern your use of iconic.events and any content, forms and materials on it (the \"site\"), operated by Iconic Events LLC (\"Iconic Events\", \"we\", \"us\"). By using the site you agree to them. If you do not agree, please do not use the site.",
  ],
  sections: [
    {
      id: "services",
      heading: "Our services",
      body: [
        "The site describes the event production services we offer. Nothing on the site is an offer to provide services on particular terms. Sending an enquiry or a vendor sign-up does not create a contract or oblige either side to work together. Any engagement is governed by a separate written agreement signed by both parties, and if that agreement conflicts with these terms, the agreement wins.",
      ],
    },
    {
      id: "results",
      heading: "Case studies and results",
      body: [
        "Our case studies, figures and testimonials describe specific past events. Every event is different, and outcomes such as attendance, cost savings or revenue depend on many factors outside our control. Past results do not guarantee future results, and nothing on the site is a promise of any particular outcome.",
      ],
    },
    {
      id: "use",
      heading: "Using the site",
      body: [
        "You may use the site for lawful purposes and for your own information. You agree not to:",
        {
          list: [
            "Copy, scrape, republish or sell content from the site without our written permission.",
            "Submit false information, spam, or content that is unlawful, harmful or infringes anyone's rights.",
            "Interfere with the site's operation or security, or try to access areas you are not authorized to use.",
          ],
        },
      ],
    },
    {
      id: "ip",
      heading: "Intellectual property",
      body: [
        "The site and its content, including text, photographs, video, graphics, logos and design, belong to Iconic Events or are used under license, and are protected by copyright, trademark and other laws. The Iconic Events name and logo are our trademarks. Names and marks of clients and other companies shown on the site belong to their owners and appear to identify our work with them, not to suggest endorsement. You may not use any of this content without our prior written permission.",
      ],
    },
    {
      id: "submissions",
      heading: "What you send us",
      body: [
        [
          "You are responsible for the information you submit and confirm it is accurate and that you have the right to share it. We handle personal information as described in our ",
          { a: "Privacy Policy", href: "/privacy" },
          ".",
        ],
      ],
    },
    {
      id: "links",
      heading: "Third-party links and services",
      body: [
        "The site links to and embeds third-party services, such as social networks and video players. We do not control them and are not responsible for their content or practices. Your use of them is governed by their own terms and policies.",
      ],
    },
    {
      id: "disclaimer",
      heading: "Disclaimer",
      body: [
        "The site is provided \"as is\" and \"as available\". To the fullest extent the law allows, we disclaim all warranties, express or implied, including warranties of accuracy, merchantability, fitness for a particular purpose and non-infringement. We do not guarantee that the site will be uninterrupted, error free or free of harmful components.",
      ],
    },
    {
      id: "liability",
      heading: "Limitation of liability",
      body: [
        "To the fullest extent the law allows, Iconic Events and its owners, employees and partners will not be liable for any indirect, incidental, special, consequential or punitive damages, or for lost profits, revenue or data, arising from your use of or inability to use the site, even if we were told such damages were possible. Our total liability for any claim relating to the site will not exceed one hundred US dollars. Some places do not allow these limits, so they may not all apply to you.",
      ],
    },
    {
      id: "indemnity",
      heading: "Indemnity",
      body: [
        "You agree to indemnify and hold Iconic Events harmless from claims, losses and costs, including reasonable legal fees, arising from your misuse of the site or your breach of these terms.",
      ],
    },
    {
      id: "law",
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of the State of Florida, without regard to its conflict of law rules. Any dispute relating to the site will be brought in the state or federal courts located in Miami-Dade County, Florida, and you consent to their jurisdiction.",
      ],
    },
    {
      id: "changes",
      heading: "Changes",
      body: [
        "We may update these terms from time to time. The date at the top shows when they last changed. Continuing to use the site after a change means you accept the updated terms. If any part of these terms is found unenforceable, the rest remains in effect.",
      ],
    },
    {
      id: "contact",
      heading: "Contact us",
      body: [
        ["Questions about these terms: email ", mail, ` or call ${PHONE}.`],
      ],
    },
  ],
}
