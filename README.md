Three-tier Todo App - Full working version (Complete)
----------------------------------------------------

How to run (KillerCoda or local with Docker):

1. Ensure Docker and docker compose are available. On minimal hosts, install docker and the compose plugin as needed.

2. Unzip and change directory:
   unzip three-tier-todo-app-complete.zip -d app
   cd app

3. Build & start:
   docker compose up --build -d

4. Access:
   Frontend: http://localhost:8080  (or use the public URL in KillerCoda port mapping)
   Backend API: http://localhost:3000
   Metrics: http://localhost:3000/metrics

5. Test flow:
   - Register a user via the UI.
   - Login (token stored in localStorage).
   - Create tasks, toggle complete, delete.
   - Observe metrics increment at /metrics.

6. Teardown:
   docker compose down -v

Notes:
- Inside containers services talk via service names: backend -> db uses host 'db'; frontend nginx proxies to 'backend'.
- For production use, secure .env and use managed DBs and monitoring.
