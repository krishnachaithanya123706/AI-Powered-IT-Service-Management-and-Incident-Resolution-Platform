# Implementation Plan - AI-Powered IT Service Management & Incident Resolution Platform

Design and build an AI-Powered IT Service Management (ITSM) and Incident Resolution Platform with a **React** frontend, **Node.js / Express** backend, and **SQLite** database. The platform features automated ticket prioritization, AI resolution recommendations, infrastructure health monitoring, service catalog requests, change management, and executive operational dashboards.

## User Review Required

> [!IMPORTANT]
> - **Tech Stack**: Frontend: React (Vite), Backend: Node.js + Express, Database: SQLite (embedded, persistent file-based database requiring zero external service setup, ready for seamless Dockerization).
> - **AI Capabilities**: Includes a rule-and-heuristic AI Resolution Engine for automated incident scoring, root cause analysis, automated ticket assignment, and interactive IT copilot recommendations.

## Proposed Architecture & Component Structure

```
.
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── index.js         # SQLite database connection & initial schema migration
│   │   ├── services/
│   │   │   ├── aiEngine.js      # AI classification, priority matrix & resolution recommendations
│   │   │   └── slaService.js    # SLA calculations & breach warnings
│   │   ├── controllers/
│   │   │   ├── incidentController.js
│   │   │   ├── assetController.js
│   │   │   ├── changeController.js
│   │   │   └── serviceRequestController.js
│   │   ├── routes/
│   │   │   └── api.js           # REST API router endpoints
│   │   └── server.js            # Node/Express server setup
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/          # Navigation, SLA Badges, AI Resolution Modal, Stats Widgets
    │   ├── pages/               # Dashboard, Incidents, Assets, Service Catalog, Changes, AI Copilot
    │   ├── services/            # Axios API calls
    │   ├── App.jsx              # Application router & main layout
    │   └── index.css            # Modern glassmorphism & dark-mode styled UI
    ├── package.json
    └── vite.config.js
```

---

## Proposed Changes

### Backend (Node.js + Express + SQLite)

#### [NEW] [backend/package.json](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/backend/package.json)
- Express, sqlite3 / better-sqlite3 or sqlite, cors, dotenv, nodemon setup.

#### [NEW] [backend/src/db/index.js](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/backend/src/db/index.js)
- Initializes SQLite tables for `incidents`, `assets`, `changes`, `service_requests`, `ai_knowledge_base`, and `audit_logs`.
- Seeds realistic initial demo data for enterprise IT operations.

#### [NEW] [backend/src/services/aiEngine.js](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/backend/src/services/aiEngine.js)
- Smart AI engine for:
  - Incident impact & priority matrix evaluation (Critical, High, Medium, Low).
  - Recommended resolution steps based on ticket symptoms & historical KB patterns.
  - Automatic tier-1/tier-2 team assignment recommendations.
  - Root cause analysis suggestion.

#### [NEW] [backend/src/routes/api.js](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/backend/src/routes/api.js)
- RESTful endpoints for CRUD on incidents, assets, service requests, change requests, metrics, and AI assistant prompt processing.

#### [NEW] [backend/src/server.js](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/backend/src/server.js)
- Main Express server entry point on port 5000 with CORS and error handling middleware.

---

### Frontend (React + Vite + Lucide Icons)

#### [NEW] [frontend/package.json](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/frontend/package.json)
- React, Vite, Lucide-react icons, Axios.

#### [NEW] [frontend/src/index.css](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/frontend/src/index.css)
- Premium dark-mode modern design system with sleek color palette, CSS variables, glassmorphic cards, smooth badge animations, and responsive flex/grid layouts.

#### [NEW] [frontend/src/pages/Dashboard.jsx](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/frontend/src/pages/Dashboard.jsx)
- Overview analytics: Active incidents, MTTR, SLA Compliance Rate, Infrastructure Health, recent alerts, incident breakdown charts.

#### [NEW] [frontend/src/pages/Incidents.jsx](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/frontend/src/pages/Incidents.jsx)
- Incident management table & filter, create incident form with automatic AI priority assessment, incident detail modal with AI resolution suggestions.

#### [NEW] [frontend/src/pages/Infrastructure.jsx](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/frontend/src/pages/Infrastructure.jsx)
- IT Asset monitoring dashboard (Servers, DB Clusters, Cloud Load Balancers, API Gateways), real-time status indicators, auto-trigger simulated infrastructure incident button.

#### [NEW] [frontend/src/pages/ServiceCatalog.jsx](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/frontend/src/pages/ServiceCatalog.jsx)
- Self-service requests catalog (Access Management, Hardware Provisioning, Software Licenses), status tracking.

#### [NEW] [frontend/src/pages/ChangeManagement.jsx](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/frontend/src/pages/ChangeManagement.jsx)
- Change Requests (RFC) portal, risk impact evaluation, CAB approval workflows.

#### [NEW] [frontend/src/pages/AICopilot.jsx](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/frontend/src/pages/AICopilot.jsx)
- Interactive ITSM AI Copilot for support agents to query runbooks, log summaries, and draft post-mortems.

---

## Verification Plan

### Automated Verification
- Verify backend API start up and SQLite database seeding: `node src/server.js` or `npm run dev`.
- Test API routes via endpoint health check (`GET http://localhost:5000/api/health`, `GET http://localhost:5000/api/incidents`, `GET http://localhost:5000/api/metrics`).
- Verify frontend build and development server launch via Vite: `npm run build` / `npm run dev`.

### Manual Verification
- Test creating new incidents and observing AI priority calculation and SLA timers.
- Test resolving an incident with AI-recommended action steps.
- Test triggering an infrastructure alert and checking auto-generated incident creation.
- Test submitting service catalog requests and change requests.
