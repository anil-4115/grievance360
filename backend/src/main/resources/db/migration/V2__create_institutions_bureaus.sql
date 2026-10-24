-- Create bureaus and institutions tables
CREATE TABLE bureaus (
    id UUID PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE institutions (
    id UUID PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(150),
    bureau_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_institutions_bureau FOREIGN KEY (bureau_id) REFERENCES bureaus(id)
);

CREATE INDEX idx_institutions_bureau_id ON institutions(bureau_id);
CREATE INDEX idx_institutions_name ON institutions(name);
CREATE INDEX idx_institutions_code ON institutions(code);
