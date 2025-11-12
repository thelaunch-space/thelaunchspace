-- Alter the existing email column to be nullable
-- (This ensures the form works if a user *only* provides WhatsApp)
ALTER TABLE public.leads
ALTER COLUMN email DROP NOT NULL;
