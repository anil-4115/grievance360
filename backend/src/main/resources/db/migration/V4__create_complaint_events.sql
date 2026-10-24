-- Create complaint events table (append-only)
CREATE TABLE complaint_events (
    id UUID PRIMARY KEY,
    complaint_id UUID NOT NULL,
    event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    actor VARCHAR(150) NOT NULL,
    action VARCHAR(50) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_complaint_events_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

CREATE INDEX idx_complaint_events_complaint_id ON complaint_events(complaint_id);
CREATE INDEX idx_complaint_events_timestamp ON complaint_events(event_timestamp);
CREATE INDEX idx_complaint_events_complaint_timestamp ON complaint_events(complaint_id, event_timestamp);
