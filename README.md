# 🤖 AI-Powered IT Service Management & Incident Resolution Platform (IT Operations)

An intelligent, full-stack IT Service Management (ITSM) and Incident Resolution platform built with **React**, **Node.js / Express**, and an embedded persistent **SQLite** database.

---

## 🌟 Key Features

1. **Executive Operations & Incident Dashboard**:
   - Real-time KPI metrics: Active Incidents, P1 Outages, SLA Compliance Rate (%), MTTR (Mean Time to Resolve), and Infrastructure Health Score (%).
   - Live activity audit stream and queue of AI auto-scored priority incidents.

2. **AI-Driven Incident Resolution Engine**:
   - **Auto-Prioritization (P1 Critical - P4 Low)** based on symptom impact and service criticality.
   - **Automated Support Routing** (DevOps, SecOps, Database Admins, Network NOC).
   - **Resolution Playbook Generation** with root cause hypotheses and 1-click automated resolution execution.

3. **Infrastructure & Asset Health Monitoring**:
   - Real-time telemetry for Kubernetes clusters, Database instances, API Gateways, and Cloud instances.
   - **Fault Simulation Button**: Interactive feature to simulate node failure, trigger automated alerts, and generate P1 incidents in real time.

4. **Service Catalog Requests**:
   - Self-service portal for hardware provisioning, AWS/GCP IAM developer roles, and enterprise SaaS licenses.

5. **Change Management (CAB Review)**:
   - Request for Change (RFC) portal with risk assessment scoring, CAB board review, and scheduled deployment approvals.

6. **Interactive AI Operations Copilot**:
   - Conversational IT Operations Assistant for querying runbooks, generating incident post-mortems, and troubleshooting complex error logs.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React (Vite) + Lucide-React Icons + Glassmorphic Enterprise Dark CSS
- **Backend**: Node.js + Express.js REST API
- **Database**: SQLite3 (`itsm.db` persistent file DB - zero external database server setup required!)

---

## 🚀 Quickstart - Running Locally

### 1. Run Backend (Node.js API on port 5000)
```bash
cd backend
npm install
npm run start
```
*Backend API will run at `http://localhost:5000/api`*

### 2. Run Frontend (React Vite App on port 5173)
```bash
cd frontend
npm install
npm run dev
```
*Frontend interface will run at `http://localhost:5173`*

---

## 🐳 Dockerization Guide (Optional Containerization)

For containerization, you can build separate Docker images for the frontend and backend using the provided templates below.

### Backend `Dockerfile` (`backend/Dockerfile`)
```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Frontend `Dockerfile` (`frontend/Dockerfile`)
```dockerfile
FROM node:24-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### `docker-compose.yml` (Root Directory)
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend/itsm.db:/app/itsm.db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

To launch with Docker Compose:
```bash
docker-compose up --build
```

CI/CD test - Jenkins Poll SCM