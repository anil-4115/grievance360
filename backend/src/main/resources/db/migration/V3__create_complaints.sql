-- Create complaints table
CREATE TABLE complaints (
    id UUID PRIMARY KEY,
    reference_id VARCHAR(30) NOT NULL UNIQUE,
    institution_id UUID NOT NULL,
    bureau_id UUID,
    category VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    assigned_to VARCHAR(150),
    transfer_count INTEGER NOT NULL DEFAULT 0,
    unassigned BOOLEAN NOT NULL DEFAULT TRUE,
    stale BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    age_days INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT fk_complaints_institution FOREIGN KEY (institution_id) REFERENCES institutions(id),
    CONSTRAINT fk_complaints_bureau FOREIGN KEY (bureau_id) REFERENCES bureaus(id)
);

CREATE INDEX idx_complaints_institution_id ON complaints(institution_id);
CREATE INDEX idx_complaints_bureau_id ON complaints(bureau_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_reference_id ON complaints(reference_id);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
CREATE INDEX idx_complaints_last_updated_at ON complaints(last_updated_at);
