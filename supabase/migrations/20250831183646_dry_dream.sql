/*
  # Add status column to tasks table

  1. Schema Changes
    - Add `status` column to `tasks` table with values: 'not_started', 'wip', 'completed'
    - Set default value to 'not_started'
    - Add CHECK constraint to ensure valid status values
    - Migrate existing `completed` boolean data to new `status` column

  2. Data Migration
    - Convert `completed = true` to `status = 'completed'`
    - Convert `completed = false` to `status = 'not_started'`

  3. Security
    - No changes to RLS policies needed (existing policies will work with new column)
*/

-- Add the new 'status' column with default value and constraint
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'not_started';

-- Add CHECK constraint to ensure valid status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'tasks_status_check' AND table_name = 'tasks'
  ) THEN
    ALTER TABLE public.tasks
    ADD CONSTRAINT tasks_status_check CHECK (status IN ('not_started', 'wip', 'completed'));
  END IF;
END $$;

-- Migrate existing 'completed' boolean data to new 'status' column
UPDATE public.tasks
SET status = CASE
  WHEN completed = true THEN 'completed'
  ELSE 'not_started'
END
WHERE status = 'not_started'; -- Only update rows that still have the default value