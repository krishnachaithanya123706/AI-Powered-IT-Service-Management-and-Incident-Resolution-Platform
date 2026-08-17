# 🎓 Comprehensive Assignment Assessment Report
## AI-Powered IT Service Management & Incident Resolution Platform

---

## 1. Problem Analysis

### 1.1 Problem Statement
Modern enterprise IT environments handle high volumes of service desk requests, server infrastructure alerts, and system change requests. Traditional ITSM platforms often suffer from manual ticket triaging delays, lack of automated root cause analysis, and operational bottlenecks. There is a critical need for an **AI-Powered IT Service Management & Incident Resolution Platform** that automates ticket scoring, SLA tracking, root cause hypothesis generation, infrastructure health monitoring, and resolution playbook execution.

### 1.2 Project Objectives
- Build an enterprise-grade full-stack ITSM application with automated ticket scoring (P1 Critical - P4 Low).
- Implement full CRUD (Create, Read, Update, Delete) capabilities across Incidents, Infrastructure Assets, Service Requests, and Change Management (RFC).
- Containerize the entire application stack (React Frontend, Node.js Backend, MongoDB Database, and Mongo Express UI) using Docker and Docker Compose.
- Establish a version control system using Git with a structured branching model.

### 1.3 Functional Requirements
- **Incident Desk**: Ticket creation, auto-prioritization, assigned team routing, SLA countdowns, full CRUD operations, and AI resolution execution.
- **IT Infrastructure Monitoring**: Real-time server telemetry (CPU, RAM, status), asset creation/editing, and interactive fault simulation alerts.
- **Service Request Catalog**: Self-service portal for hardware, access IAM, and software license requests with approval workflow management.
- **Change Management (CAB Review)**: Request for Change (RFC) portal with risk assessment scoring, lead architect assignment, and CAB approval steps.
- **AI Operations Copilot**: Interactive conversational assistant for querying runbooks, error log summaries, and drafting post-mortems.

### 1.4 Expected Outcomes
- Reduced Mean Time to Resolve (MTTR) through AI-driven resolution playbooks.
- Zero-downtime containerized deployment across development and production environments.
- Maintainable, scalable, and audit-compliant codebase.

---

## 2. Project Structure Design

### 2.1 Repository Folder Structure
```
AI-Powered Service Management Platform SE/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── index.js              # Mongoose MongoDB connection & auto-seeding
│   │   ├── models/
│   │   │   ├── Incident.js           # Mongoose Incident Schema
│   │   │   ├── Asset.js              # Mongoose Infrastructure Asset Schema
│   │   │   ├── ServiceRequest.js     # Mongoose Service Request Schema
│   │   │   ├── ChangeRequest.js      # Mongoose Change Request (RFC) Schema
│   │   │   └── ActivityLog.js        # Mongoose Audit Trail Schema
│   │   ├── routes/
│   │   │   └── api.js                # Express REST API CRUD endpoints
│   │   ├── services/
│   │   │   └── aiEngine.js           # AI ticket prioritization & copilot logic
│   │   └── server.js                 # Express server entry point
│   ├── Dockerfile                    # Node.js backend Docker container build file
│   └── package.json                  # Backend dependencies (Express, Mongoose, CORS)
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, Sidebar, Modals (New/Edit/Confirm Delete)
│   │   ├── pages/                    # Dashboard, Incidents, Assets, Catalog, Changes, AICopilot
│   │   ├── services/
│   │   │   └── api.js                # Client API service wrapper
│   │   ├── App.jsx                   # Main layout and tab routing
│   │   └── index.css                 # Styling system
│   ├── Dockerfile                    # Multi-stage React Vite & Nginx Dockerfile
│   ├── nginx.conf                    # Nginx reverse proxy configuration
│   ├── package.json                  # Frontend dependencies (React, Vite, Lucide Icons)
│   └── vite.config.js                # Vite build configuration
├── .gitignore                        # Git exclusion rules
├── docker-compose.yml                # Multi-container orchestrator configuration
├── DOCKER_PORTING_GUIDE.md           # Custom port allocation documentation
└── ASSIGNMENT_ASSESSMENT_REPORT.md   # Complete assessment report
```

### 2.2 Purpose & Justification of Key Component Directories
- **`backend/src/models/`**: Encapsulates data schema definitions enforcing type safety and validation via Mongoose.
- **`backend/src/routes/api.js`**: Centralized RESTful API routing ensuring separation of concerns between business logic and database queries.
- **`frontend/src/components/`**: Reusable modular UI components (e.g. `ConfirmDeleteModal`, `EditIncidentModal`, `NewAssetModal`).
- **`frontend/src/services/api.js`**: Decouples API network layer from UI component rendering.
- **`docker-compose.yml`**: Declarative configuration orchestrating multi-container startup, volumes, and networking.

---

## 3. Git Repository Initialization

### 3.1 Steps for Git Repository Initialization
1. Initialize local repository:
   ```bash
   git init -b main
   ```
2. Configure `.gitignore` to exclude large binaries, OS cache, dependencies, and environment files:
   ```gitignore
   node_modules/
   dist/
   *.db
   .env
   *.log
   ```
3. Stage all source files:
   ```bash
   git add .
   ```
4. Create initial commit:
   ```bash
   git commit -m "chore: initialize repository and add .gitignore configuration"
   ```
5. Link remote repository:
   ```bash
   git remote add origin https://github.com/pramithm/AI-Powered-IT-Service-Management-and-Incident-Resolution-Platform.git
   ```

### 3.2 Purpose of Essential Git Files
- **`.gitignore`**: Prevents tracking auto-generated dependencies (`node_modules`), build artifacts (`dist/`), and database files (`itsm.db`), preserving repository cleanliness and security.
- **`README.md`**: Provides architectural overview, quickstart instructions, and stack documentation for project onboarding.

---

## 4. Git Branching Strategy

### 4.1 Selected Branching Strategy (Git Flow Model)
We adopted a structured **Git Flow** branching model consisting of:
- **`main`**: Production-ready code; highly stable.
- **`development`**: Integration branch for assembling tested features.
- **`feature/backend-api-crud`**: Dedicated feature branch for backend REST endpoints and MongoDB schemas.
- **`feature/frontend-components-crud`**: Feature branch for React pages and CRUD modal components.
- **`feature/docker-containerization`**: Feature branch for Dockerfiles and Docker Compose configuration.

### 4.2 Justification
This branching model provides strict isolation between ongoing development, infrastructure setup, and production releases. It enables parallel feature development without risk of destabilizing the primary `main` codebase.

---

## 5. Version Control Workflow

### 5.1 Demonstrated Workflow Steps
1. **Branch Creation**:
   ```bash
   git checkout -b development
   ```
2. **Atomic Part-by-Part Commits**:
   - Committing backend features: `feat(backend): implement Express REST server and MongoDB Mongoose schemas`
   - Committing frontend features: `feat(frontend): implement React UI dashboard and CRUD modal components`
   - Committing container setup: `feat(docker): add Dockerfiles and multi-service Docker Compose configuration`
3. **Branch Merging**:
   ```bash
   git checkout main
   git merge development
   ```
4. **Repository Synchronization**:
   ```bash
   git push -u origin main
   git push -u origin development
   ```

---

## 6. Commit History Analysis

### 6.1 Commit History Overview
| Commit Hash / Step | Message | Purpose |
| :--- | :--- | :--- |
| **Commit 1** | `chore: initialize repository structure and add .gitignore` | Initialize repo and ignore dependencies/build files. |
| **Commit 2** | `feat(backend): implement Express REST API endpoints and Mongoose models` | Add backend server, AI engine, and MongoDB CRUD. |
| **Commit 3** | `feat(frontend): implement React ITSM interface, CRUD modals, and AI Copilot` | Add React components, pages, and client API service. |
| **Commit 4** | `feat(docker): add Dockerfiles, Nginx config, and multi-service docker-compose.yml` | Containerize frontend, backend, MongoDB, and Mongo Express. |
| **Commit 5** | `docs: add custom port allocation guide and comprehensive assignment assessment report` | Provide full assessment documentation and port reference. |

### 6.2 Conventional Commit Best Practices
All commits follow Conventional Commits format (`type(scope): concise description`). This practice improves repository readability, simplifies audit trails, and facilitates automated changelog generation.

---

## 7. Docker Environment Design

### 7.1 Why Docker is Suitable
- **Environment Parity**: Ensures identical execution across developer machines, CI pipelines, and production servers.
- **Zero Local Dependency Pollution**: Eliminates manual installation of database binaries or server instances on the host system.
- **Isolation & Portability**: Runs application microservices in lightweight isolated containers.

### 7.2 Containerized Components
1. **Frontend App (`itsm-frontend`)**: React Vite SPA served via Nginx.
2. **Backend API (`itsm-backend`)**: Node.js Express REST API server.
3. **Database (`itsm-mongodb`)**: MongoDB 7.0 document database.
4. **Database Admin (`itsm-mongo-express`)**: Web-based Mongo Express management UI.

---

## 8. Dockerfile Development

### 8.1 Backend Dockerfile ([`backend/Dockerfile`](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/backend/Dockerfile))
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```
- `FROM node:20-alpine`: Uses lightweight Alpine Linux Node image.
- `WORKDIR /app`: Sets container working directory.
- `COPY package*.json ./`: Copies package files first to leverage Docker layer caching.
- `RUN npm install --production`: Installs production dependencies only.
- `COPY . .`: Copies application source files.
- `CMD ["npm", "start"]`: Defines default container entrypoint command.

### 8.2 Frontend Dockerfile ([`frontend/Dockerfile`](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/frontend/Dockerfile))
```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
- **Multi-Stage Build**: First stage compiles static bundle via Vite; second stage transfers static dist assets to Nginx web server, resulting in a tiny, secure production image (< 25MB).

---

## 9. Docker Compose Design

### 9.1 Multi-Service Configuration ([`docker-compose.yml`](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/docker-compose.yml))
```yaml
version: '3.8'

services:
  mongo:
    image: mongo:7.0
    container_name: itsm-mongodb
    restart: always
    ports:
      - "27019:27017"
    environment:
      MONGO_INITDB_DATABASE: itsm_db
    volumes:
      - mongo_data:/data/db

  mongo-express:
    image: mongo-express:latest
    container_name: itsm-mongo-express
    restart: always
    ports:
      - "8085:8081"
    environment:
      ME_CONFIG_MONGODB_SERVER: mongo
      ME_CONFIG_MONGODB_PORT: 27017
      ME_CONFIG_MONGODB_ENABLE_ADMIN: "true"
      ME_CONFIG_BASICAUTH_USERNAME: admin
      ME_CONFIG_BASICAUTH_PASSWORD: pass
    depends_on:
      - mongo

  backend:
    build: ./backend
    container_name: itsm-backend
    restart: always
    ports:
      - "5005:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/itsm_db
      - PORT=5000
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    container_name: itsm-frontend
    restart: always
    ports:
      - "3005:80"
    depends_on:
      - backend

volumes:
  mongo_data:
```

### 9.2 Port Allocation & Conflict Prevention
- **Frontend App**: Host `3005` $\rightarrow$ Container `80`
- **Backend API**: Host `5005` $\rightarrow$ Container `5000`
- **Mongo Express UI**: Host `8085` $\rightarrow$ Container `8081`
- **MongoDB Database**: Host `27019` $\rightarrow$ Container `27017`

---

## 10. Container Deployment and Testing

### 10.1 Execution Commands
To build and launch all containers in detached mode:
```bash
docker-compose up --build -d
```

### 10.2 Verification & Evidence
- **Backend API**: Verified endpoints via test script (`POST`, `GET`, `PATCH`, `DELETE` operations returned `200 OK` / `201 Created`).
- **Frontend Build**: Verified Vite production bundle build (`built in 9.47s`).
- **MongoDB Connection**: Verified Mongoose automated data seeding into `itsm_db`.

---

## 11. Benefits of Git and Docker

- **Collaboration**: Git enables developers to work asynchronously on feature branches while Docker guarantees code executes identically across every machine.
- **Portability**: Complete application stack boots up anywhere using a single `docker-compose up` command.
- **Scalability**: Backend and frontend containers can be independently scaled horizontally in Kubernetes or AWS ECS.

---

## 12. Challenges and Improvements

### 12.1 Challenges Encountered
- **Port Collisions**: Host ports `27017`, `3000`, `5000`, and `8081` were actively used by other local containers. Resolved by creating custom port mappings (`27019`, `3005`, `5005`, `8085`).
- **Database Migration**: Transitioned from embedded SQLite callbacks to Mongoose `async/await` document models.

### 12.2 Future Enhancements
- Implement GitHub Actions CI/CD pipelines for automated testing and container image publishing to Docker Hub.
- Add JWT authentication and HTTPS TLS certificate termination in Nginx.
