/*
  # Add status column to tasks table

  1. Schema Changes
    - Add `status` column to `tasks` table with three possible values:
      - 'not_started' (default)
      - 'wip' (work in progress)
      - 'completed'
    - Remove the existing `completed` boolean column
    - Update existing data to use new status system

  2. Security
    - Maintain existing RLS policies
    - Update policies to work with new status column

  3. Data Migration
    - Convert existing completed tasks to 'completed' status
    - Set incomplete tasks to 'not_started' status
*/

-- Add the new status column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'status'
  ) THEN
    ALTER TABLE tasks ADD COLUMN status text DEFAULT 'not_started';
  END IF;
END $$;

-- Add check constraint for status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'tasks_status_check'
  ) THEN
    ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
    CHECK (status IN ('not_started', 'wip', 'completed'));
  END IF;
END $$;

-- Migrate existing data from completed boolean to status
UPDATE tasks 
SET status = CASE 
  WHEN completed = true THEN 'completed'
  ELSE 'not_started'
END
WHERE status = 'not_started';

-- Drop the old completed column
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'completed'
  ) THEN
    ALTER TABLE tasks DROP COLUMN completed;
  END IF;
END $$;

-- Insert sample tasks for demonstration
INSERT INTO tasks (user_id, title, description, priority, status) VALUES
-- Not Started tasks
(auth.uid(), 'Design new landing page', 'Create wireframes and mockups for the new product landing page', 'high', 'not_started'),
(auth.uid(), 'Set up CI/CD pipeline', 'Configure automated testing and deployment workflow', 'medium', 'not_started'),
(auth.uid(), 'Research competitor analysis', 'Analyze top 5 competitors and document findings', 'low', 'not_started'),

-- Work In Progress tasks
(auth.uid(), 'Implement user authentication', 'Build login/register functionality with JWT tokens', 'high', 'wip'),
(auth.uid(), 'Write API documentation', 'Document all REST endpoints with examples', 'medium', 'wip'),
(auth.uid(), 'Update team onboarding guide', 'Revise documentation for new team members', 'low', 'wip'),

-- Completed tasks
(auth.uid(), 'Database schema design', 'Design and implement initial database structure', 'high', 'completed'),
(auth.uid(), 'Set up development environment', 'Configure local development tools and dependencies', 'medium', 'completed'),
(auth.uid(), 'Create project repository', 'Initialize Git repository with basic structure', 'low', 'completed')

ON CONFLICT (id) DO NOTHING;