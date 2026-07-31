# Deploying the Frontend to Vercel

This short guide explains how to deploy the Vite + React frontend that lives in expense_tracker_frontend/ to Vercel.

Quick summary
- The repo already contains vercel.json at the repository root which builds the app from expense_tracker_frontend/package.json and serves the SPA.

Steps — Vercel dashboard (recommended)
1. Go to Vercel → Import Project → select the GitHub repository SMARTCODING-eng/sme_expense_tracker.
2. In the import settings set:
   - Root Directory: `expense_tracker_frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   (You can leave the Framework Preset as Vite or Other.)
3. Add environment variables (Preview and Production):
   - `VITE_API_BASE_URL` = `https://your-backend-host.example.com/api`
     (Replace with your backend's base API URL; include the `/api` suffix the frontend expects.)
4. Deploy. Vercel will build and publish the site at `https://<your-project>.vercel.app`.

Optional — Vercel CLI
- Install & login: `npm i -g vercel && vercel login`
- From the repo root run: `vercel --cwd=expense_tracker_frontend` (or `vercel --prod --cwd=expense_tracker_frontend` for production)
- Follow prompts to set build command and output directory, or rely on the included vercel.json.

Local build test
```bash
cd expense_tracker_frontend
npm install
npm run build
# a dist/ directory should be produced; optionally serve it locally to verify
npx serve dist
```

Important notes
- CORS: Ensure your Django backend (config/settings.py) allows requests from the Vercel domain (e.g. `https://<your-project>.vercel.app`) via `CORS_ALLOWED_ORIGINS` or `CORS_ALLOW_ALL_ORIGINS` when appropriate.
- API URL: The frontend reads the API base URL from `import.meta.env.VITE_API_BASE_URL` — set this variable in Vercel as shown above.
- SPA routing: vercel.json contains a routing rule to serve index.html for all paths so client-side routes work.

Files touched
- `/vercel.json` — already added to repository root to instruct Vercel how to build the app from `expense_tracker_frontend`.

If you want, I can also:
- Add this content into the existing `expense_tracker_frontend/README.md` instead of a separate file.
- Create a short CI note or GitHub Actions workflow to automatically trigger Vercel (not necessary; Vercel integrates on push).
