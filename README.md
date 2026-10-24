# Grievance360

Grievance360 is an SIH 2026 prototype for unified institution-related complaint monitoring,
cross-bureau coordination and workflow intelligence.

## Tech Stack

### Frontend
- React + TypeScript + Vite
- Tailwind CSS v4 (via @tailwindcss/vite)
- React Router, Axios, Recharts

### Backend
- Java 21, Spring Boot 3.5.x, Maven
- Spring Web, Spring Security, Spring Data JPA, Validation
- PostgreSQL, Flyway

### API
- Base path: `/api/v1`

## Project Structure

```
grievance360/
├── frontend/   # React + Vite app
├── backend/    # Spring Boot app
├── docs/       # Documentation
└── README.md
```

## Prerequisites

- Node.js 20.19+ / 22.12+ (tested with Node 24.x)
- npm 11.x
- Java 21 (Temurin/Oracle)
- Maven 3.9.x
- PostgreSQL 17 running locally (or accessible)

## Environment Setup

1. Copy `.env.example` to `.env` (do not commit `.env`).
2. Update database credentials in `.env` or set environment variables:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `SERVER_PORT` (default 8080)

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Build for production:
```bash
cd frontend
npm run build
```

## Running the Backend

Set `JAVA_HOME` to Java 21 if needed (Windows example):
```bash
set JAVA_HOME=D:\Softwares\JDKKK
```

Run with Maven:
```bash
cd backend
mvn spring-boot:run
```

Run tests:
```bash
cd backend
mvn test
```

Health endpoint:
- `GET http://localhost:8080/api/v1/health`

## Database Migrations

Flyway migrations are in `backend/src/main/resources/db/migration/`. Migrations run automatically on startup when enabled.

## Notes

- Phase 1 only: foundation scaffolding, health endpoint, initial migration, tests/builds.
- No credentials are committed. Use environment variables only.
- Spring Boot is the authoritative owner of complaint state (per PROJECT_SPEC.md).
- Frontend and backend are independently runnable.
