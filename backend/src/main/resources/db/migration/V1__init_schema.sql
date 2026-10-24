-- Initial schema placeholder for Grievance360
-- Phase 1: foundation only. Domain entities will be added in subsequent phases.

CREATE TABLE IF NOT EXISTS schema_migrations_placeholder (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    note TEXT
);

COMMENT ON TABLE schema_migrations_placeholder IS 'Placeholder table created by initial Flyway migration for Phase 1 foundation.';
