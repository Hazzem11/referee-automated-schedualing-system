# Referee availability — project TODO / roadmap

Use this as the master checklist. Items are **not** all required for a class demo; group **Production** vs **MVP** as you prioritize.

---

## Already in place (baseline)

- [x] Spring Boot API + H2 + JPA (`referees`, `games`, availability JSON on referees)
- [x] OptaPlanner solver + REST: `GET/POST /api/assignments/current|solve`
- [x] React app: home, scheduler, game manager, assignments, referee list
- [x] CRA dev proxy to backend (`package.json` → `http://localhost:8080`)
- [x] Google Places autocomplete on **game location** (when `REACT_APP_GOOGLE_MAPS_API_KEY` is set); lat/lng stored on games
- [x] Travel soft constraint uses **Haversine km** when both referee home + game have coordinates; else falls back to simple name-grid distance
- [x] Seed data via `DataInitializer` on empty DB

---

## Environment & Google Cloud

- [ ] Create **Google Cloud** project; enable **Maps JavaScript API** + **Places API**
- [ ] Create browser API key; **restrict by HTTP referrer** (localhost + prod domain)
- [ ] Add to `referee-availability/.env`: `REACT_APP_GOOGLE_MAPS_API_KEY=...` (never commit `.env`)
- [ ] (Optional) Add **Places (New)** / billing review — Google gives monthly credits; monitor usage in Cloud Console

---

## Data & persistence

- [ ] **Persist across restarts**: switch H2 from in-memory to **file** (`jdbc:h2:file:./data/referee`) or move to **PostgreSQL** / MySQL
- [ ] Add **Flyway/Liquibase** migrations if you want controlled schema changes (recommended once not solo-dev)
- [ ] Decide what happens to **solver results**: today the last solution is **in-memory** on the server (`AtomicReference`) — optionally **persist** assignments after solve (new table or JSON column)

---

## Locations (full “real world” path)

- [ ] **Referee home location**: UI to set/edit `homeLocation` + **Places autocomplete** + store `homeLat` / `homeLng` / `homePlaceId` (model fields exist; need API + form + `PATCH/PUT /api/referees/:id`)
- [ ] **Preferred venues**: today stored as comma-separated strings; consider structured list of place IDs or at least validated labels
- [ ] **Max travel distance**: constraint exists as soft penalty only in spirit — add **hard** constraint: `distance_km > maxTravelDistance` (needs consistent units + lat/lng on both ends)
- [ ] Remove or shrink **fallback** `LocationDistance` grid once all entities have coordinates

---

## Product / UX gaps

- [ ] **Referee list**: remove or gate **mock data** fallback; show clear error if API down
- [ ] **Assignments page**: remove large **mock solution** block; show user-friendly error when API fails instead of fake data
- [ ] **Assistant referees**: table has columns; solver assigns **one referee per `RefereeAssignment` row** — align UI (multiple rows per game vs “main + assistant” columns) or extend model
- [ ] **Navigation**: add visible link to `/games` from every page (or shared nav bar)
- [ ] **Empty states**: no referees / no games / no solution yet — guided copy + buttons
- [ ] **Accessibility**: labels, focus, contrast pass on key forms

---

## Security & accounts

- [ ] **No auth today** — anyone can call APIs. Add **Spring Security** + login (session or JWT) if exposed beyond localhost
- [ ] **CORS**: locked to `localhost:3000` in `WebConfig` — update for production origins
- [ ] **Secrets**: ensure `serviceAccountKey.json`, `.env`, and any DB URLs stay **gitignored**

---

## Quality & operations

- [ ] **Tests**: JUnit for mapper, constraint provider (ConstraintVerifier), REST smoke tests
- [ ] **Frontend tests**: minimal RTL tests for critical flows
- [ ] **CI**: GitHub Actions (or similar): `mvn test`, `npm run build`
- [ ] **npm audit**: address CRA toolchain debt over time (or migrate to **Vite**)
- [ ] **README**: single “how to run” for this folder (replace default CRA README boilerplate)

---

## Solver / rules (optional hardening)

- [ ] **Max games per week** as a real constraint (was deferred; needs careful OptaPlanner grouping)
- [ ] **Crew size**: `requiredReferees` creates multiple assignment rows — verify UX and constraints for all slots
- [ ] **Prefer venue** soft constraint compares string labels; align with Places formatted address or place ID
- [ ] **Termination**: tune solver time limit / best-score stop for production workloads

---

## Optional integrations

- [ ] **Firebase / Firestore**: only if you want cloud data again — would need sync or replace H2; `populateData.js` is optional
- [ ] **Email / notifications** (mentioned in root README) — not implemented

---

## Quick “definition of done” (suggested)

For a **solid MVP** you can demo end-to-end:

1. Backend + UI run reliably; data survives at least **file H2** or external DB.
2. Referees and games both have **lat/lng** from Places where possible.
3. Solve returns assignments you can explain; no reliance on **mock** assignment data in production path.
4. Basic **error handling** when API is down (no silent mock).
5. README + `.env.example` kept accurate.

---

*Last updated: generated for project tracking — edit freely.*
