# Edge Function Logic — generate-operational-plan

**Function name:** `generate-operational-plan`
**Type:** Supabase Edge Function (Deno)
**Trigger:** POST from quiz form on submission
**Auth:** None for MVP (public endpoint, validate input server-side)

---

## Input Payload

Sent by the frontend on quiz completion:

```json
{
  "name": "Jane",
  "email": "jane@agencyname.com",
  "company_name": "Agency Name",
  "website": "agencyname.com",
  "revenue_band": "€1M–€3M",
  "team_size": "16–40",
  "services": ["SEO", "Paid Media", "Content & Social"],
  "pm_tool": "ClickUp",
  "crm": "HubSpot",
  "biggest_bottleneck": "Delivery",
  "main_goal": "Reduce founder hours",
  "implementation_help": true,
  "answers": {
    "q1": 1,
    "q2": 0,
    "q3": 1,
    "q4": 0,
    "q5": 0,
    "q6": 0,
    "q7": 1,
    "q8": 0,
    "q9": 1,
    "q10": 0,
    "q11": 0,
    "q12": 0,
    "q13": 1,
    "q14": 0
  }
}
```

---

## Full Function Flow

### Step 1 — Validate payload

```
Required fields: name, email, company_name, revenue_band, team_size, answers
answers must contain keys q1–q14
each answer value must be 0, 1, or 2
email must be valid format

If validation fails:
  return 400 with { error: "Invalid payload", details: [...] }
```

---

### Step 2 — Insert quiz submission

```
INSERT INTO quiz_submissions:
  name, email, company_name, website, revenue_band, team_size,
  services, pm_tool, crm, biggest_bottleneck, main_goal,
  implementation_help, raw_answers (as jsonb), status = 'processing'

Return: submission_id
```

---

### Step 3 — Calculate category scores

Map answers to categories:

```
category_scores = {
  delivery_operations:          (q1 + q2) / 4 * 100,
  crm_pipeline:                 (q3 + q4) / 4 * 100,
  reporting_forecasting:        (q5 + q6) / 4 * 100,
  automation_ai:                (q7 + q8) / 4 * 100,
  team_cadence_accountability:  (q9 + q10) / 4 * 100,
  founder_dependency:           (q11 + q12) / 4 * 100,
  sales_process:                (q13 + q14) / 4 * 100
}

overall_score = mean(values(category_scores)), rounded to integer

maturity_label:
  overall_score < 40  → "Reactive"
  overall_score < 70  → "Developing"
  overall_score >= 70 → "Scalable"

top_weaknesses = bottom 3 categories sorted by score ascending
top_strengths  = top 3 categories sorted by score descending
```

---

### Step 4 — Calculate lead quality score

```
lead_score = 0

revenue_band:
  "€500k–€1M"  → +10
  "€1M–€3M"    → +15
  "€3M–€10M"   → +20

team_size:
  "5–15"   → +10
  "16–40"  → +15
  "41–80"  → +20

overall_score:
  < 40   → +20  (high need)
  < 70   → +15  (active pain)
  >= 70  → +5   (lower urgency)

biggest_bottleneck:
  any value (all our services) → +20

implementation_help == true → +20

qualification_status:
  lead_score >= 75 → "hot"
  lead_score >= 50 → "warm"
  lead_score < 50  → "nurture"
```

---

### Step 5 — Insert assessment scores

```
INSERT INTO assessment_scores:
  submission_id,
  overall_score,
  lead_gen_score        (= sales_process score),
  crm_score,
  sales_score           (= sales_process score),
  delivery_score        (= delivery_operations score),
  reporting_score       (= reporting_forecasting score),
  automation_score      (= automation_ai score),
  leadership_score      (= team_cadence_accountability score),
  top_weaknesses        (jsonb array of bottom 3 category names),
  top_strengths         (jsonb array of top 3 category names)
```

---

### Step 6 — Fetch recommendation rules

```
For each category in top_weaknesses:
  SELECT * FROM recommendation_rules
  WHERE category = [category]
  AND threshold_type = 'below'
  AND threshold_value > category_scores[category]
  ORDER BY priority ASC
  LIMIT 2

Also fetch 'between' rules for categories in 40–69 range:
  SELECT * FROM recommendation_rules
  WHERE category = [category]
  AND threshold_type = 'between'
  AND threshold_value_min <= category_scores[category]
  AND threshold_value_max >= category_scores[category]
  LIMIT 1

Collect all matched_rules as array
```

---

### Step 7 — Insert lead scoring record

```
INSERT INTO lead_scoring:
  submission_id,
  icp_fit_score     (revenue + team size points),
  urgency_score     (overall_score points),
  buying_intent_score (bottleneck + implementation_help points),
  total_score       (= lead_score),
  qualification_status
```

---

### Step 8 — Build AI prompt

**System message:**
```
You are a B2B operations consultant specialising in marketing agencies.
Your task is to generate a sharp, specific, personalised 90-day operational plan
based on the diagnostic assessment results provided.

Rules:
- Use only the data provided. Do not invent facts, tools, or claims not in the input.
- Be direct and specific. Avoid generic advice.
- All recommendations must be grounded in the matched rules and scores provided.
- Output must be valid JSON matching the provided schema exactly.
- Tone: confident, direct, like a trusted senior advisor.
- Do not use filler phrases like "it's important to" or "consider implementing".
```

**User message payload:**
```json
{
  "company_profile": {
    "company_name": "...",
    "revenue_band": "...",
    "team_size": "...",
    "services": [...],
    "pm_tool": "...",
    "crm": "...",
    "biggest_bottleneck": "...",
    "main_goal": "..."
  },
  "scores": {
    "overall_score": 39,
    "maturity_label": "Reactive",
    "categories": {
      "Delivery Operations": { "score": 25, "label": "Reactive" },
      "CRM & Pipeline Hygiene": { "score": 25, "label": "Reactive" },
      "Reporting & Forecasting": { "score": 0, "label": "Reactive" },
      "Automation & AI Adoption": { "score": 25, "label": "Reactive" },
      "Team Cadence & Accountability": { "score": 25, "label": "Reactive" },
      "Founder Dependency": { "score": 0, "label": "Reactive" },
      "Sales Process": { "score": 25, "label": "Reactive" }
    }
  },
  "top_weaknesses": ["Founder Dependency", "Reporting & Forecasting", "Delivery Operations"],
  "top_strengths": ["CRM & Pipeline Hygiene", "Sales Process", "Automation & AI Adoption"],
  "matched_recommendations": [
    {
      "category": "Founder Dependency",
      "problem": "Founder is the key constraint...",
      "recommendation": "Identify your top delivery person...",
      "priority": "critical",
      "expected_impact": "...",
      "next_step": "..."
    }
    // ... additional matched rules
  ],
  "output_schema": {
    // paste full report-schema.json here
  }
}
```

---

### Step 9 — Call AI API

```
Model: claude-sonnet-4-6 (preferred) or gpt-4o
Temperature: 0.4 (lower = more consistent output)
Max tokens: 4000
Response format: JSON object

On call:
  - Set timeout: 30 seconds
  - Retry once on network failure only (not on validation failure)
  - Do not retry on malformed JSON (log and return error)
```

---

### Step 10 — Validate AI response

```
Parse response as JSON

Validate required top-level keys exist:
  executive_summary, overall_score, maturity_label, company_profile,
  category_summary, top_bottlenecks, priority_actions,
  day_30_plan, day_60_plan, day_90_plan,
  recommended_systems, expected_impact, next_step_cta

Validate array lengths match schema constraints
Validate overall_score matches calculated score (override if mismatch)

If validation fails:
  log error with submission_id and raw AI response
  update quiz_submissions.status = 'ai_error'
  return 500 with { error: "Report generation failed", submission_id }
```

---

### Step 11 — Save generated report

```
INSERT INTO generated_reports:
  submission_id,
  prompt_version = "v1.0",
  report_json = validated AI JSON,
  report_markdown = null (generate later if needed),
  report_html = null (rendered client-side from JSON),
  pdf_url = null (populated by export-report-pdf function),
  generated_at = now()

UPDATE quiz_submissions SET status = 'completed'

Return report_id
```

---

### Step 12 — Return response to frontend

```json
{
  "success": true,
  "submission_id": "uuid",
  "report_id": "uuid",
  "report": {
    // full validated report JSON
  }
}
```

Frontend uses `report_id` to construct the report URL:
`/report/[report_id]`

Full report JSON is returned immediately so the page can render without a second API call.

---

## Error Handling Summary

| Error | HTTP code | Action |
|---|---|---|
| Invalid payload | 400 | Return validation errors |
| Supabase insert failure | 500 | Log, return error |
| AI API timeout | 504 | Log, set status = 'ai_timeout', return error |
| AI returns invalid JSON | 500 | Log raw response, set status = 'ai_error', return error |
| AI JSON fails schema validation | 500 | Log, set status = 'ai_error', return error |

---

## Second Function — export-report-pdf

Build this after the web report is working.

**Trigger:** POST `{ report_id: "uuid" }`

**Flow:**
```
1. Fetch report from generated_reports by report_id
2. Render report_json into clean print-friendly HTML
3. Use headless browser (Puppeteer via Supabase Edge, or Browserless.io) to print HTML → PDF
4. Upload PDF to Supabase Storage: reports/{report_id}.pdf
5. UPDATE generated_reports SET pdf_url = storage_url WHERE id = report_id
6. Return { pdf_url: "..." }
```

---

## Prompt Version Management

Store `prompt_version` in `generated_reports` so you can:
- Track which prompt generated which report
- Re-generate old reports with a new prompt version
- A/B test prompt variants later

Start at `"v1.0"` and increment on any significant prompt change.

---

## Environment Variables Required

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY          (if using Claude)
OPENAI_API_KEY             (if using OpenAI)
ACTIVE_AI_PROVIDER         ("anthropic" | "openai")
PROMPT_VERSION             ("v1.0")
```
