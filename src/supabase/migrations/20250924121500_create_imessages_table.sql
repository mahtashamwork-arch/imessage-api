-- Migration: Create imessages table

CREATE TABLE IF NOT EXISTS imessages (
    id BIGSERIAL PRIMARY KEY,             -- Auto-incrementing ID
    message_id TEXT UNIQUE,               -- Unique iMessage identifier
    message_text TEXT NOT NULL,           -- Body of the message
    sender_handle TEXT,                   -- Who sent the message (phone/email)
    received_date TIMESTAMP WITH TIME ZONE, -- When the message was received
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Insert timestamp
);

-- Index for fast deduplication checks
CREATE INDEX IF NOT EXISTS idx_imessages_message_id
ON imessages(message_id);

-- Index for querying by received date
CREATE INDEX IF NOT EXISTS idx_imessages_received_date
ON imessages(received_date);
