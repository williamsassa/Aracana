<div align="center">

# ARACANA AI — Website & API

**Building Sovereign Frontier AI in Europe**

Generative AI · Coding Agent · AI Scientist · Space & Very-High Altitude · State Defense · Multi-Agent Systems

</div>

---

ARACANA AI is a European company building frontier artificial intelligence for the
sovereignty of European states and the expansion of AI across industry, finance and
everyday life. This repository contains the **complete website (frontend)** and a
**functional API (backend)**.

## Stack

| Layer        | Tech                              | Why |
|--------------|-----------------------------------|-----|
| **Frontend** | Next.js 14 (App Router) · TypeScript · Tailwind CSS | One codebase deploys to **Web** (native), **Desktop** (Tauri/Electron) and **Mobile** (Capacitor) — all web tech, no rewrite. |
| **Backend**  | FastAPI (Python 3.11) · Pydantic v2 | Fast, typed, auto-documented API. |
| **Delivery** | Docker + docker-compose           | Reproducible local & production runs. |

The frontend renders content from local data for instant, offline-friendly loads, and
calls the FastAPI backend for the **dynamic** parts (contact form, early-access &
job-application intake). The backend also exposes the full content over a typed JSON API.

## Project structure

```
AracanaProject/
├── docker-compose.yml          # run the whole stack
├── frontend/                   # Next.js app
│   ├── app/                    # routes: home, research, solutions,
│   │   ├── products/[slug]/    #   products + per-model methodology pages
│   │   ├── careers/ about/ …
│   ├── components/             # Logo, Header, Footer, GrpoSection, ContactForm…
│   ├── lib/                    # site nav, products, research/solutions, methodology, api client
│   └── public/aracana-mark.png # brand mark (rainbow orb)
└── backend/                    # FastAPI app
    ├── app/main.py             # routes
    ├── app/data.py             # single source of truth (content)
    ├── app/schemas.py          # Pydantic models
    └── app/store.py            # JSON intake persistence (V1)
```

## Site map (max 3 levels deep)

```
/ (home)
├── /research                         → 3 research axes (anchored sections)
├── /solutions                        → 6 solution domains
├── /products                         → listing (Soon / In-development badges)
│   └── /products/<slug>              → full model page + methodology (RL × Causality)
│        • generative-model
│        • coding-agent-model
│        • state-space-sovereignty-model
│        • multi-agent-system          (in development)
│        • ai-scientist                (in development)
├── /careers                          → open roles
└── /about                            → mission, principles, contact form
```

---

## Run with Docker (recommended)

```bash
docker compose up --build
```

- Web app  → http://localhost:3000
- API docs → http://localhost:8000/docs

## Run locally (without Docker)

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/Scripts/activate   # Windows Git Bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
cp .env.local.example .env.local        # points to http://127.0.0.1:8000
npm install
npm run dev                             # http://localhost:3000
```

---

## Cross-platform builds (Web · Desktop · Mobile)

The same Next.js codebase targets all three:

| Target  | How |
|---------|-----|
| **Web**     | `npm run build && npm start` (or the Docker image). |
| **Desktop** | `BUILD_TARGET=static npm run build` → `out/`, wrapped with **Tauri** or **Electron**. |
| **Mobile**  | `BUILD_TARGET=static npm run build` → `out/`, wrapped with **Capacitor** (`npx cap add ios/android`). |

`BUILD_TARGET=static` produces a fully static export; `DOCKER=1` produces a standalone
server bundle for slim containers.

---

## API reference

| Method | Endpoint                     | Description |
|--------|------------------------------|-------------|
| GET    | `/health`                    | Liveness probe |
| GET    | `/api/research`              | Research axes |
| GET    | `/api/solutions`             | Solution domains |
| GET    | `/api/products`              | Product list (`?background=true/false`) |
| GET    | `/api/products/{slug}`       | Single product (full detail) |
| GET    | `/api/methodology`           | Methodology content (RL × Causality) |
| GET    | `/api/careers/roles`         | Open roles |
| POST   | `/api/contact`               | Contact message |
| POST   | `/api/careers/apply`         | Job application |
| POST   | `/api/early-access`          | Early-access request |

Interactive docs at `/docs` (Swagger) and `/redoc`.

---

## Methodology — Reinforcement Learning × Causality

Every model page presents our public approach: two pillars (**reinforcement learning**
and **causality**), the propose → evaluate → reinforce loop, the model-specific learning
signals, and a concrete example. The State Space Sovereignty model additionally renders
an animated space-domain awareness demo (ingest → fuse → identify → neutralise). See
[`/products/coding-agent-model#methodology`](http://localhost:3000/products/coding-agent-model#methodology).

> **Note** — V1 ships production-grade placeholder content. Real benchmarks, exact
> configs and reference code land in **V2**.

---

© 2026 ARACANA AI S.A.S. · Paris · Brussels · Europe
