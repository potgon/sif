-- Migration: Add salary column to periods table and migrate existing salary data
-- This migration moves salary from global params to period-specific data

-- Step 1: Add salary column to periods table
ALTER TABLE periods ADD COLUMN salary DECIMAL(12,2) DEFAULT 0.00;

-- Step 2: Migrate existing salary data from params to periods
-- This will set the current salary for all existing periods
UPDATE periods 
SET salary = (
    SELECT CAST(value AS DECIMAL(12,2)) 
    FROM params 
    WHERE params.name = 'SALARY' 
    AND params.user_id = periods.user_id
)
WHERE EXISTS (
    SELECT 1 
    FROM params 
    WHERE params.name = 'SALARY' 
    AND params.user_id = periods.user_id
);

-- Step 3: Set default salary for periods that don't have salary data
UPDATE periods SET salary = 0.00 WHERE salary IS NULL;

-- Step 4: Make salary column NOT NULL after migration
ALTER TABLE periods ALTER COLUMN salary SET NOT NULL;

-- Step 5: Remove the old salary param (optional - you can keep it for backward compatibility)
-- DELETE FROM params WHERE name = 'SALARY';

