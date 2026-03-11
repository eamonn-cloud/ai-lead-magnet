# Score Model — Agency Ops Diagnostic

---

## 1. Category Scoring

Each category has 2 questions, each scored 0 / 1 / 2.
Max per category = 4 points.

**Category score (percentage):**
```
category_score = (points_earned / 4) × 100
```

### Maturity labels by category score

| Range | Label | Meaning |
|---|---|---|
| 0–39 | Reactive | No real system in place |
| 40–69 | Developing | Something exists, not consistent |
| 70–100 | Scalable | Working system, consistently applied |

---

## 2. Categories and Question Mapping

| Category | Q1 | Q2 | Max |
|---|---|---|---|
| Delivery Operations | Q1 | Q2 | 4 |
| CRM & Pipeline Hygiene | Q3 | Q4 | 4 |
| Reporting & Forecasting | Q5 | Q6 | 4 |
| Automation & AI Adoption | Q7 | Q8 | 4 |
| Team Cadence & Accountability | Q9 | Q10 | 4 |
| Founder Dependency | Q11 | Q12 | 4 |
| Sales Process | Q13 | Q14 | 4 |

---

## 3. Overall Maturity Score

```
overall_score = average of all 7 category scores (rounded to nearest whole number)
```

Example:
- Delivery: 50
- CRM: 25
- Reporting: 75
- Automation: 25
- Team Cadence: 50
- Founder Dependency: 0
- Sales: 50

Overall = (50 + 25 + 75 + 25 + 50 + 0 + 50) / 7 = **39** → Reactive

---

## 4. Top Weaknesses and Strengths

After scoring all categories:

- **Top 3 weaknesses** = 3 categories with the lowest scores (sorted ascending)
- **Top 3 strengths** = 3 categories with the highest scores (sorted descending)

These are passed to the AI and used to fetch recommendation rules.

---

## 5. Lead Quality Scoring

Used internally to prioritise follow-up. Not shown to the user.

| Signal | Condition | Points |
|---|---|---|
| Revenue fit | €1M–€3M | 15 |
| Revenue fit | €3M–€10M | 20 |
| Revenue fit | €500k–€1M | 10 |
| Team size fit | 16–40 | 15 |
| Team size fit | 41–80 | 20 |
| Team size fit | 5–15 | 10 |
| Overall maturity | 0–39 (Reactive) — highest need | 20 |
| Overall maturity | 40–69 (Developing) — active pain | 15 |
| Overall maturity | 70–100 (Scalable) — less urgent | 5 |
| Bottleneck match | Bottleneck = one of our core services | 20 |
| Implementation help | "Yes, I want help implementing this" | 20 |

**Max total: 100**

### Qualification tiers

| Score | Status | Action |
|---|---|---|
| 75–100 | Hot | Instant Slack/email alert, direct outreach within 24h |
| 50–74 | Warm | Nurture email sequence + follow-up in 3–5 days |
| Under 50 | Nurture | Report delivered, enter long-form nurture sequence |

### Bottleneck match mapping (our core services)

The following bottleneck answers count as a match:
- Delivery
- CRM & Pipeline
- Reporting
- Automation
- Team Accountability
- Founder Dependency
- Capacity Planning

All of the above are services we offer — so every answer scores 20.
Use this field for intent signal: the bottleneck they name tells you what to lead with in outreach.

---

## 6. Scoring Rules Summary

```
For each of 7 categories:
  category_score = (Q1_score + Q2_score) / 4 × 100

overall_score = mean(all category_scores)

maturity_label:
  overall_score < 40  → "Reactive"
  overall_score < 70  → "Developing"
  overall_score >= 70 → "Scalable"

top_weaknesses = bottom 3 categories by score
top_strengths  = top 3 categories by score

lead_score = sum of applicable lead quality points
qualification_status:
  lead_score >= 75 → "hot"
  lead_score >= 50 → "warm"
  lead_score < 50  → "nurture"
```

---

## 7. Score Display in Report

Show to user:
- Overall score as a number (e.g. 39/100)
- Overall maturity label (Reactive / Developing / Scalable)
- Each category score as a bar or score card
- Top 3 weaknesses highlighted in report body

Do NOT show to user:
- Lead quality score
- Qualification status
- Internal routing decisions
