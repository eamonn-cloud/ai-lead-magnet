

## Root Cause

The published site shows **"Uncaught Error: supabaseUrl is required"** — the `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` environment variables are not available in the published build. Since `src/integrations/supabase/client.ts` is auto-generated and cannot be edited, the Supabase client crashes on initialization and takes down the entire app.

## Fix

**Lazy-load the Supabase client** so it only initializes when actually needed (on the Report page), preventing the crash from blocking the Quiz page and app boot.

### Changes

1. **`src/pages/Report.tsx`** — Replace the static import of the Supabase client with a dynamic import or lazy getter:
   - Instead of `import { supabase } from '../integrations/supabase/client'`
   - Create a helper function `getSupabase()` that dynamically imports the client only when `send-report-email` is actually called
   - This way, if the env vars are missing, only the email-sending feature fails gracefully rather than crashing the entire app

2. **`src/App.tsx`** — Use `React.lazy()` for the Report route so its module (and thus the Supabase import) is only loaded when a user navigates to `/report/:id`

This isolates the crash: the Quiz page will load fine, and the Report page will only fail if Supabase env vars are genuinely missing.

### Why this works
- Vite bundles all static imports together; a crash in any top-level import kills the whole app
- By code-splitting Report into a lazy chunk, the Supabase client initialization is deferred
- If the env vars issue is only in the published build, this prevents a total blank page

### If it's still blank after this fix
That would confirm the environment variables are genuinely not being injected into the published build — a platform-level issue that would need to be resolved by republishing or remixing the project.

