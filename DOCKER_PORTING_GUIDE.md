# 🐳 ITSM Platform - Docker Custom Port Allocation & Container Guide

This guide details the non-conflicting port allocation configured in [`docker-compose.yml`](file:///c:/Users/HOME/Desktop/Ongoing%20Subjects%20Git%20Repo/AI-Powered%20Service%20Management%20Platform%20SE/docker-compose.yml). The host ports have been mapped to custom, high-range numbers to avoid collisions with other active Docker containers running on your machine (such as `secure_chat_m`, `todo-app`, `ciphervault`, and `calculator`).

---

## 📌 Dedicated Port Allocation Matrix

| Service | Container Name | Host Port | Container Port | Purpose / Access URL |
| :--- | :--- | :---: | :---: | :--- |
| **React Frontend** | `itsm-frontend` | **`3005`** | `80` | [http://localhost:3005](http://localhost:3005) |
| **Express Backend API** | `itsm-backend` | **`5005`** | `5000` | [http://localhost:5005/api](http://localhost:5005/api) |
| **Mongo Express UI** | `itsm-mongo-express` | **`8085`** | `8081` | [http://localhost:8085](http://localhost:8085) |
| **MongoDB Database** | `itsm-mongodb` | **`27019`** | `27017` | `mongodb://localhost:27019/itsm_db` |

---

## 🚫 Avoided Active Port Conflicts

The following ports were detected as **already in use** on your Docker system and were deliberately avoided:
- ❌ **`27017` / `27018`**: Used by `secure_chat_m`, `ciphervault-m`, and `docker-user-app`
- ❌ **`3000` / `3001`**: Used by `todo-frontend` and `docker-user-app`
- ❌ **`5000` / `5001` / `5002`**: Used by `todo-backend` and `docker-user-app`
- ❌ **`5020` / `5173` / `5400`**: Used by `static container`, `ciphervault-fr`, `calculator`
- ❌ **`8080` / `8081` / `8082` / `8083`**: Used by `todo-adminer`, `ciphervault-m`, `mongo-express`

---

## 🚀 How to Run & Manage the Stack

### 1. Start All Containers in Background
```bash
docker-compose up --build -d
```

### 2. Check Running Container Status
```bash
docker-compose ps
```

### 3. View Logs for Specific Services
```bash
# View backend API logs
docker logs -f itsm-backend

# View MongoDB database logs
docker logs -f itsm-mongodb
```

### 4. Stop All Containers
```bash
docker-compose down
```

---

## 🌐 Accessing Services in Your Browser

- **React ITSM Portal**: Open `http://localhost:3005`
- **Mongo Express Web Admin**: Open `http://localhost:8085`
  - **Login Username**: `admin`
  - **Login Password**: `pass`
- **Backend API Health Check**: Open `http://localhost:5005/health`

---

## 🔌 Connecting Local GUI Tools (e.g., MongoDB Compass)

To connect from MongoDB Compass or DBeaver installed on your host machine:
- **Host**: `localhost`
- **Port**: `27019`
- **Authentication**: `None`
- **Connection URI**: `mongodb://localhost:27019/itsm_db`
