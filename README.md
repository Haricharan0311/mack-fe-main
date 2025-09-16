# mack-frontend — Therapist Dashboard (React)

Front-end for the **Mack Voice Insights** project. This dashboard lets therapists explore insights derived from patient voice notes:
- Mood timeline & trend
- Trigger distribution & weekday patterns
- Meal pattern summaries
- Cognitive distortions
- Relapse sequence flow

The app consumes the REST APIs provided by **mack-functions** and uses Supabase auth for secure access.

---

## ✨ Features
- **Patients list & detail** pages with access control
- **Charts** for mood, triggers, meals, distortions, relapse
- **Auth** via Supabase (JWT) → `Authorization: Bearer <token>` to backend
- **Data fetching** with React Query (caching, retries, stale-time)
- **Responsive UI** with Tailwind CSS (+ optional shadcn/ui & lucide-react)
- **Env-driven** API base URL; easy to switch between dev/staging/prod

---

## 🧰 Tech Stack
- **React 18** + **Vite** (fast dev server, HMR)
- **TypeScript** (recommended but optional)
- **Tailwind CSS**, **shadcn/ui** (optional), **lucide-react** (icons)
- **React Query** for data fetching/caching
- **Recharts** (or Chart.js) for visualizations
- **Supabase JS** for auth/session (client‑side only, anon key)
- **ESLint** + **Prettier** for quality & consistency

> You can swap Recharts with Chart.js if you prefer. The examples below assume Recharts.

---

## ⚙️ Prerequisites
- Node.js **>= 18**
- An instance of **mack-functions** running (local or remote)
- A **Supabase** project configured with the same auth users/tenancy as the backend

---

## 🔑 Environment Setup
Create `.env` from the example below (Vite expects `VITE_*`):

```ini
# .env
# Base URL of the mack-functions API (e.g., http://localhost:3000 or https://api.example.com)
VITE_API_BASE_URL=http://localhost:3000

# Supabase (client-side anon key is OK; RLS must protect data server-side)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Optional
VITE_APP_NAME=Mack Therapist Dashboard
VITE_SENTRY_DSN=
```

> Keep **service-role** keys out of the frontend. RLS and server auth must guard sensitive data.

---

## 🚀 Getting Started

```bash
# 1) Install deps
npm install

# 2) Configure env
cp .env.example .env   # create and fill (or create .env as shown above)

# 3) Run dev server
npm run dev

# 4) Build & preview
npm run build
npm run preview
```

Open http://localhost:5173 (default Vite port).

---

## 🔌 API Integration

The frontend calls the following mack-functions endpoints with a Bearer token from Supabase:

- `GET /api/patients` → list of patients for the therapist
- `GET /api/patients/:id` → patient detail + computed `moodTrend`
- `GET /api/charts/:patientId/mood`
- `GET /api/charts/:patientId/triggers`
- `GET /api/charts/:patientId/meals`
- `GET /api/charts/:patientId/distortions`
- `GET /api/charts/:patientId/relapse`

### Example fetcher (React Query)
```ts
// api/client.ts
import { createClient } from "@supabase/supabase-js";

const API = import.meta.env.VITE_API_BASE_URL;
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

async function authHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getJSON<T>(path: string): Promise<T> {
  const headers = { "Content-Type": "application/json", ...(await authHeader()) };
  const res = await fetch(`${API}${path}`, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

### Query hooks
```ts
// api/queries.ts
import { useQuery } from "@tanstack/react-query";
import { getJSON } from "./client";

export function usePatients() {
  return useQuery({ queryKey: ["patients"], queryFn: () => getJSON("/api/patients"), staleTime: 60_000 });
}

export function usePatientMood(id: string) {
  return useQuery({ queryKey: ["charts","mood",id], queryFn: () => getJSON(`/api/charts/${id}/mood`), staleTime: 60_000 });
}
```

---

## 🧱 Suggested Directory Structure

```
src/
  main.tsx                  # app bootstrap
  App.tsx                   # routes
  lib/
    supabase.ts             # supabase client init
    queryClient.ts          # react-query client
  api/
    client.ts               # fetch + auth header
    queries.ts              # typed hooks per endpoint
    types.ts                # API response interfaces
  pages/
    LoginPage.tsx
    PatientsPage.tsx
    PatientDetailPage.tsx
  components/
    charts/
      MoodChart.tsx
      TriggersChart.tsx
      MealsChart.tsx
      DistortionsChart.tsx
      RelapseFlow.tsx
    ui/
      Card.tsx  Button.tsx  Spinner.tsx  EmptyState.tsx
  styles/
    index.css               # Tailwind base & custom styles
```

---

## 🧪 Types (example)

```ts
export interface Patient {
  id: string;
  name: string;
  lastNoteAt?: string;
  moodTrend?: "up" | "down" | "stable";
}

export interface MoodPoint {
  date: string;        // YYYY-MM-DD
  valence: number;     // -10..10
  dominant_emotion: string;
}
```

---

## 📊 Chart Components (Recharts)

```tsx
// components/charts/MoodChart.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { MoodPoint } from "../../api/types";

export default function MoodChart({ data }: { data: MoodPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis domain={[-10, 10]} />
          <Tooltip />
          <Line type="monotone" dataKey="valence" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

> Triggers can be a stacked bar or heatmap; meals a grouped bar; distortions a bar/word-cloud; relapse a stepped flow or list grouped by phase.

---

## 🔐 Authentication Flow

1. User logs in via Supabase (email magic link or OAuth).
2. Supabase client stores a session (access token).
3. On each request, the frontend sends `Authorization: Bearer <token>` to mack-functions.
4. The backend validates & applies therapist↔patient checks (and RLS protects at the DB level).

**Route Guards**: Wrap protected routes in a component that checks `supabase.auth.getSession()` and redirects to `/login` if missing.

---

## 🧿 Accessibility & UX Notes
- Use semantic elements (`<main>`, `<nav>`, `<section>`); label charts with descriptive titles & aria labels.
- Provide **empty states** and **loading** skeletons.
- Show **last updated** timestamps for charts (helps when using cached data).

---

## 🧪 Quality
- `npm run lint` → ESLint
- `npm run typecheck` → TypeScript
- `npm test` → your testing framework (e.g., Vitest + React Testing Library)

### Example CI (GitHub Actions)
```yml
name: frontend-ci
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci || npm install
      - run: npm run typecheck --if-present
      - run: npm run lint --if-present
      - run: npm test --if-present
      - run: npm run build
```

---

## 🐳 Docker (optional)
```Dockerfile
# Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build & run:
```bash
docker build -t mack-frontend .
docker run -p 8080:80 --env-file .env mack-frontend
```

> For SSR (Next.js) you’d use a different container; this is for static SPA builds.

---

## 🧯 Troubleshooting
- **401/403 from API** → User not signed in; ensure Supabase session exists and token is attached in headers.
- **CORS errors** → Configure CORS on the backend to allow your frontend origin.
- **Blank charts** → Check API responses in network tab; verify patient access and that analysis data exists.
- **Rate limits** → Tune React Query retries/backoff; surface friendly errors.
- **Env not picked up** → Vite only exposes vars prefixed with `VITE_`.

---

## 🔒 Security
- Never embed service-role keys in the frontend.
- Rely on backend auth checks + RLS; frontend should not gatekeep sensitive logic.
- Sanitize any user-provided strings shown in the UI.

---

## 📝 License
MIT
