# Guardian

A little more guidance. A little less overwhelm.

Mobile-first Vue 3 MVP. Educational support only — no diagnosis, no prescriptions.

## Run

```bash
npm install
npm run dev
```

Open the local URL on your phone or a mobile viewport. Test learner is **Myles, 6**.

## Screens

1. **Learners** — profile, age-based checklists, strengths, battery notes
2. **Today's Plan** — battery + time + focus, mock AI plan from checklists
3. **Progress** — mark done, log observation, weekly checklist practice (no score)

Data is stored in local storage. Supabase is stubbed in `src/lib/supabase.js`.

Mock APIs:

- `POST /api/generate-checklists` `{ age }`
- `POST /api/generate-plan` `{ learner, battery, time, focus }`
