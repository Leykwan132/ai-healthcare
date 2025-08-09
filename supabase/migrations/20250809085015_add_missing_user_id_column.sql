-- Add missing user_id column to doctors table
-- This column should have been created in the original migration but seems to be missing

-- Step 1: Add the column as nullable first
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS user_id uuid;

-- Step 2: Update existing doctor records to link them with user records
-- This maps the existing doctors to their corresponding users based on the original migration data
UPDATE public.doctors 
SET user_id = CASE 
  WHEN license_number = 'MD001234' THEN '550e8400-e29b-41d4-a716-446655440001'::uuid
  WHEN license_number = 'MD001235' THEN '550e8400-e29b-41d4-a716-446655440002'::uuid
  WHEN license_number = 'MD001236' THEN '550e8400-e29b-41d4-a716-446655440003'::uuid
  WHEN license_number = 'MD001237' THEN '550e8400-e29b-41d4-a716-446655440004'::uuid
  WHEN license_number = 'MD001238' THEN '550e8400-e29b-41d4-a716-446655440005'::uuid
END
WHERE license_number IN ('MD001234', 'MD001235', 'MD001236', 'MD001237', 'MD001238');

-- Step 3: Add the NOT NULL constraint and foreign key reference
ALTER TABLE public.doctors ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.doctors ADD CONSTRAINT fk_doctors_user_id 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Step 4: Create index for the user_id column for better query performance
CREATE INDEX IF NOT EXISTS idx_doctors_user_id_new ON public.doctors(user_id);
