Smart Feedback System — Faculty and Facilities

Overview

This repository contains a full-stack application for collecting, analyzing, and reporting student feedback on faculty and institutional facilities. It includes a FastAPI backend, a React + Vite frontend, PostgreSQL database, and Docker-based development environment.

Project structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   └── schemas/
│   ├── alembic/
│   │   └── versions/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── alembic.ini
├── frontend/
│   ├── public/
│   ├── src/
│   └── Dockerfile
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Makefile
└── README.md
```

Quick start (development)

1) Copy environment file

```bash
cp .env.example .env
```

2) Start the stack

```bash
make up
```

3) Access services

- Backend API: http://localhost:8000
- API docs (Swagger): http://localhost:8000/docs
- Frontend: http://localhost:5173
- Postgres: localhost:5432

Common commands

```bash
make up         # build and start all services
make down       # stop and remove containers
make logs       # follow logs
make sh-backend # shell into backend container
make sh-frontend# shell into frontend container
make db-shell   # psql into database
```

Notes

- Initial scaffolding focuses on structure. Subsequent steps will add models, routes, and UI.
- Alembic migrations folder is created; migration scripts will be added once models are defined.

