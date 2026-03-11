# Quiz Questions — Agency Ops Diagnostic

**Lead magnet:** A tailored 90-day operational plan for marketing agencies
**Target:** Marketing agencies, €500k–€10M revenue, 5–80 staff

---

## Section 1 — Company Profile (not scored, context only)

Used to personalise the report and calculate lead quality score.

| Field | Type | Options |
|---|---|---|
| First name | Text | — |
| Company name | Text | — |
| Website | Text | — |
| Revenue band | Single select | €500k–€1M / €1M–€3M / €3M–€10M |
| Team size | Single select | 5–15 / 16–40 / 41–80 |
| Services offered | Multi-select | SEO, Paid Media, Content & Social, Web & Development, PR & Comms, Full Service, Other |
| Current PM tool | Single select | None / Spreadsheets / Asana / Monday.com / ClickUp / Notion / Other |
| Current CRM | Single select | None / Spreadsheets / HubSpot / Salesforce / Pipedrive / Other |
| Biggest bottleneck right now | Single select | Delivery / CRM & Pipeline / Reporting / Automation / Team Accountability / Founder Dependency / Capacity Planning |
| Main goal for next 12 months | Single select | Grow revenue / Improve margins / Build and delegate the team / Reduce founder hours / All of the above |

---

## Section 2 — Operational Maturity (scored)

**Answer scale for all questions:**
- No → 0
- Partially → 1
- Yes → 2

**7 categories, 2 questions each = 14 questions, max 28 points**

---

### Category 1: Delivery Operations

**Q1.** Are your delivery processes and workflows documented and consistently followed by the team?

- No — we rely on individual knowledge (0)
- Partially — some things written down, inconsistently used (1)
- Yes — documented, accessible, and followed by all (2)

**Q2.** Are client handoffs between team members or departments handled through a clear, standardised process?

- No — ad hoc, prone to things falling through the cracks (0)
- Partially — informal norms exist but no formal handoff process (1)
- Yes — clear handoff steps with checklists or defined criteria (2)

---

### Category 2: CRM & Pipeline Hygiene

**Q3.** Are all active deals and prospects tracked in a CRM with current, accurate information?

- No — we use spreadsheets, email, or nothing (0)
- Partially — CRM exists but rarely kept up to date (1)
- Yes — CRM is consistently maintained by everyone on the team (2)

**Q4.** Are your pipeline stages clearly defined with agreed entry and exit criteria?

- No — stages are vague or unused (0)
- Partially — stages exist but no real discipline around them (1)
- Yes — defined stages, consistently applied across all deals (2)

---

### Category 3: Reporting & Forecasting

**Q5.** Do you produce a monthly performance or financial report for the business?

- No — no regular reporting (0)
- Partially — occasional or inconsistent reports (1)
- Yes — monthly, consistent, and reviewed by leadership (2)

**Q6.** Can you forecast revenue for the next 90 days with reasonable confidence?

- No — little visibility beyond current month (0)
- Partially — rough estimates based on gut feel (1)
- Yes — based on pipeline data and recurring revenue (2)

---

### Category 4: Automation & AI Adoption

**Q7.** Are repetitive admin tasks (reporting, onboarding, invoicing, status updates) automated?

- No — most admin is still done manually (0)
- Partially — one or two things automated (1)
- Yes — multiple workflows automated, saving meaningful time (2)

**Q8.** Is your team actively using AI tools in a structured way to improve speed or quality of work?

- No — not using AI tools (0)
- Partially — a few people experimenting informally (1)
- Yes — structured adoption with defined use cases and workflows (2)

---

### Category 5: Team Cadence & Accountability

**Q9.** Do you run a structured weekly team meeting or operating cadence?

- No — meetings are ad hoc or reactive (0)
- Occasionally — sometimes happens, not reliable (1)
- Yes — consistent weekly cadence, standing agenda (2)

**Q10.** Are team members held to clear performance targets or KPIs that are tracked regularly?

- No — no defined targets (0)
- Partially — targets exist on paper, rarely reviewed (1)
- Yes — tracked and reviewed at least monthly (2)

---

### Category 6: Founder Dependency

**Q11.** Can client work be delivered without the founder's direct involvement?

- No — founder is in the day-to-day delivery (0)
- Partially — involved only in key accounts or escalations (1)
- Yes — team delivers independently across all accounts (2)

**Q12.** Are key decisions (hiring, pricing, client escalations) delegated to team leads?

- No — founder makes most decisions (0)
- Partially — some delegation, but most still routes through founder (1)
- Yes — documented decision rights, team leads are empowered (2)

---

### Category 7: Sales Process

**Q13.** Do you have a documented, repeatable process for converting new business leads?

- No — every deal is handled differently (0)
- Partially — informal process exists in someone's head (1)
- Yes — documented process, consistently followed (2)

**Q14.** Is outreach or lead generation activity happening consistently each week?

- No — fully reactive, only when pipeline is empty (0)
- Occasionally — happens in bursts, not weekly (1)
- Yes — consistent weekly outreach or lead gen activity (2)

---

## Section 3 — Contact & CTA

| Field | Type | Notes |
|---|---|---|
| Work email | Email | Required |
| Would you like help implementing this plan? | Yes / No | Used for lead scoring |
| Consent checkbox | Boolean | Required — "I agree to receive this report and occasional updates" |

---

## Quiz UX Notes

- Total questions: 14 scored + 10 profile fields = under 5 minutes
- Progress bar visible throughout
- Section 2 displayed as clean radio cards (No / Partially / Yes), not dropdowns
- Section 1 can use a conversational step layout ("Tell us about your agency")
- Email capture at the end, before showing the loading/generation screen
- No question skipping allowed in Section 2
- Save progress in local state in case of accidental navigation
