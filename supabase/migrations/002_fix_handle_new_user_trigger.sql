-- Fix handle_new_user trigger function
-- Make it SECURITY DEFINER so it can insert into profiles bypassing RLS
-- Also set search_path to prevent privilege escalation

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO profiles (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$;
