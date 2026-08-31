# Case Study Intake

What Iconic Events needs to collect before a case study page can go live. Copy
this list per event. Nothing here is optional if the page is going to be
indexed and cited: an unanswered row becomes a visible gap on the page, and
invented figures are never used to fill one.

House rules that drive this list:
- Only three performance metrics are published: **attendance**, **days of
  production**, and **cost saved for the client**. Client revenue, sponsorship
  dollars, revenue per seat and lead count are not published.
- Nothing gets estimated. A missing number stays a visible gap.
- No em dashes in any published copy.

---

## A. Photography (8 positions per page)

| # | Position on the page | Ratio | Spec |
|---|---|---|---|
| 01 | Hero. Title overlays the lower third | 16:9 | 2400 x 1350, webp under 400kb, keep lower third clear of faces |
| 02 | Beside the challenge | 4:5 | 1200 x 1500, the audience seated |
| 03 | Full bleed after the approach | 21:9 | 2400 x 1030, the build with no people in frame |
| 04 | Under the results | 4:3 | 1600 x 1200, the close from the floor |
| 05 | Under the results | 4:3 | 1600 x 1200, wide enough to read the attendance figure |
| 06 | Lightbox gallery | 4:3 | 1600 x 1200 |
| 07 | Lightbox gallery | 4:3 | 1600 x 1200 |
| 08 | Lightbox gallery | 4:3 | 1600 x 1200 |

Also needed for every event:
- [ ] Photographer name for credit
- [ ] Written usage rights covering web publication

## B. Video (2 embeds per page)

- [ ] **Client trailer.** The event film Iconic Events produced. 16:9 embed link
      (Vimeo or YouTube), 60 to 90 seconds. Shows the room.
- [ ] **Client testimonial.** The client on camera. 16:9 embed link, 30 to 60
      seconds. Speaking to what they needed and what was delivered, not to spend.
      If no testimonial exists, the row collapses and the written quote runs full
      width. Do not substitute the written quote into the video slot.

## C. The three published metrics

- [ ] **Attendance.** Verified headcount.
- [ ] **Days of production.** On site days.
- [ ] **Cost saved for the client**, and how it was calculated. The headline
      leads with this figure, so it is the highest value single input on the page.

## D. Facts for the copy and the schema

- [ ] Exact event dates, ISO 8601. Required for the Event startDate in Article schema.
- [ ] Venue name and verified street address. Verify against a current source:
      a wrong address in structured data is worse than omitting it.
- [ ] Weeks of planning. Answers one FAQ.
- [ ] Whether a budget range can be published for this event or this production
      tier at all. Answers one FAQ. Publish nothing until confirmed.
- [ ] Which vendors Iconic managed directly, and what that consolidation saved.
      Feeds the Scope of Services block.
- [ ] Which post event assets were delivered, and how they were used afterward.
      Completes the post event stage of the approach.
- [ ] Publication date for the Article schema.

## E. Client sign off

- [ ] **Written quote**, verbatim, two sentences. Ask about what they needed
      going in and what one accountable team was like instead of a vendor list.
      Steer away from figures.
- [ ] **Written permission to publish** the quote. Without this the Review
      schema cannot ship: marking up a review that does not exist is false
      structured data and a documented cause of Google penalties.
- [ ] Client's exact job title and company name, for the attribution line.
- [ ] Whether the client has a public event page to link to.

## F. Decisions Iconic has to make once, not per event

- [ ] **Is the no-client-revenue rule site wide or case studies only?** The
      lander currently publishes client revenue in several places: the featured
      tile stats, the archive tiles, and the In the Room carousel. If the rule is
      site wide, those need the same treatment.
- [ ] **Third party brand names.** Internal copy for Casino Royale says "007
      Casino Royale". Case study pages say "Casino Royale themed", because an
      indexed page courting AI citation carries trademark exposure that internal
      copy does not. Confirm the house position.
- [ ] **Hosting rewrite.** Per event pages are real URLs on a single page app.
      Without a host rewrite of unknown paths to index.html, a visitor or crawler
      hitting /case-studies/<slug> directly gets a 404.

---

## Status: Casino Royale

Held already:

| Item | Value |
|---|---|
| Client | Ben Newman |
| Venue | Palms Casino Resort, Las Vegas, Nevada |
| Year | 2023 |
| Attendance | 150 |
| Repeat booking | Yes, Iconic produced the 2024 event |
| Photos 02, 03, 04, 06, 07, 08 | g34, g31, g32, g9, g24, g25 in `public/images/gallery/` |

Outstanding: photos 01 and 05, photographer credit and rights, both videos,
days of production, cost saved, exact dates, weeks of planning, budget
position, vendor detail, post event assets, the written quote and permission,
Ben Newman's exact title (currently assumed "Founder, Ben Newman Companies",
unverified), and the Palms street address.
