-- Genesis 22 Database Initialization
-- Creates initial database structures and configurations

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create audit log function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE genesis_dev TO genesis;
GRANT ALL PRIVILEGES ON SCHEMA public TO genesis;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO genesis;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO genesis;

-- Create initial indexes for common queries
-- These will be replaced by Prisma migrations but serve as backup
