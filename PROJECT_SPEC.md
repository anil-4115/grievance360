# Grievance360 — Project Specification

## 1. Project Purpose

Grievance360 is an SIH 2026 prototype for unified institution-related complaint monitoring,
cross-bureau coordination and workflow intelligence.

It provides a single place to register, route, track and analyze institution-related
complaints across bureaus, while surfacing workflow bottlenecks through explainable,
rule-based analytics.

## 2. Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Maven

### Database
- PostgreSQL
- Flyway for database migrations

### Analytics
- Java-based rules initially
- Python and scikit-learn may be added later

### API
- API prefix: `/api/v1`

## 3. Core Modules

1. Institution registry
2. Complaint registration and tracking
3. Complaint assignments and transfers
4. Append-only complaint event history for ordinary application workflows
5. Institution-wise unified case dashboard
6. Potential cross-bureau overlap detection
7. Waiting-time and stale-case detection
8. Repeated-transfer detection
9. Configurable Bottleneck Impact Score
10. Explainable next-action recommendations
11. Related complaint suggestions
12. Role-based access control and audit logging

## 4. Initial Roles

- `CENTRAL_ADMIN`
- `BUREAU_OFFICER`
- `INSTITUTION_USER`

## 5. Domain Entities

- User
- Institution
- Bureau
- Complaint
- Assignment
- ComplaintEvent
- Attachment
- Deadline
- Recommendation
- RelatedComplaint
- AuditLog

## 6. Architectural Rules

- Spring Boot is the authoritative owner of complaint state.
- Use DTOs and service-layer business logic.
- Record important workflow changes transactionally.
- Preserve complaint event history.
- Never trust frontend role checks as the sole security mechanism.
- Never expose confidential complaint information through public endpoints.
- Do not automatically merge, reject or close complaints using AI.
- Every recommendation must include its reason and supporting evidence.
- Keep deadlines, routing rules and analytical thresholds configurable.
- Use synthetic demo data only.
- Do not invent official AICTE rules, integrations, datasets or performance improvements.
- Do not introduce microservices unless justified by a specific requirement.

## 7. Development Process

- Implement one phase at a time.
- Write tests for every business-critical feature.
- Run the relevant build and tests after each phase.
- Report changed files, commands executed, test results and unresolved issues.
- Never claim a test passed unless it was actually executed.
- Do not overwrite existing working code without reviewing it first.
