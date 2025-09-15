Three-tier Todo App (React frontend, Node backend, Postgres)

How to run (on your machine):

1. Unzip the package and open a terminal in project root:
   cd three-tier-todo-app-full

2. Build and run with Docker Compose (this builds frontend & backend images):
   docker compose up --build

   - Frontend will be available at: http://localhost:8080
   - Backend API (inside compose network accessible by service name 'backend') is at: http://backend:3000 (inside containers)
   - Metrics endpoint: http://localhost:3000/metrics
   - Postgres: service name 'db' (inside network); mapped to host port 5432

3. Register and login via the frontend UI. Metrics exposed at /metrics will include counters for:
   - todoapp_requests_total
   - todoapp_user_signups_total
   - todoapp_user_logins_total
   - todoapp_events_created_total
   - todoapp_tasks_created_total

4. Stop and remove containers:
   docker compose down -v

Notes:
- Frontend proxies /api calls to http://backend:3000 inside the container network (nginx config).
- Use the .env file to change DB credentials and JWT secret.
- For production/real workloads, secure secrets and use managed DBs.
