/* The public contact address, in one place.

   A role account rather than a person's inbox: it appears in the footer of
   every page, in the Organization schema Google reads, and in the enquiry
   form's fallback, so it is scraped. Routing it to whoever should answer is
   a mail setting, not a code change.

   This address must exist before it ships. Publishing one that does not,
   or that nobody monitors, loses enquiries silently: exactly what happened
   with the iconicevents.com address this replaced.

   index.html carries the same value in its Organization JSON-LD. Static
   HTML cannot import, so that one is maintained by hand; change both. */
export const CONTACT_EMAIL = "contact@iconic.events"
