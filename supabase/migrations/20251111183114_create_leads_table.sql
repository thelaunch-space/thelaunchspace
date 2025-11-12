/*
  # Create leads submission table

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `project_description` (text, required) - What the user is building
      - `email` (text, required) - Contact email
      - `whatsapp_number` (text, optional) - Optional WhatsApp contact
      - `prefer_whatsapp` (boolean, default false) - Whether user prefers WhatsApp
      - `created_at` (timestamptz) - Submission timestamp
  
  2. Security
    - Enable RLS on `leads` table
    - Add policy for inserting leads (public access for form submissions)
    - Add policy for authenticated admin users to read leads
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_description text NOT NULL,
  email text NOT NULL,
  whatsapp_number text,
  prefer_whatsapp boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);