-- Ensure notes column exists in transactions table
-- This migration is a safety check in case the notes column was missing

-- Add notes column if it doesn't exist (PostgreSQL)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'transactions' 
        AND column_name = 'notes'
    ) THEN
        ALTER TABLE transactions ADD COLUMN notes TEXT;
    END IF;
END $$;
