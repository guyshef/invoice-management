-- Supabase Schema for LLC Invoice Manager

-- 1. Create Companies Table
CREATE TABLE public.companies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  tax_id text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for Companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own companies."
  ON public.companies FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own companies."
  ON public.companies FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- 2. Create Folders Table
CREATE TABLE public.folders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES public.companies ON DELETE CASCADE NOT NULL,
  year integer NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Folders
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage folders of their own companies."
  ON public.folders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.companies 
      WHERE companies.id = folders.company_id 
      AND companies.user_id = auth.uid()
    )
  );

-- 3. Create Invoices Table
CREATE TABLE public.invoices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES public.companies ON DELETE CASCADE NOT NULL,
  folder_id uuid REFERENCES public.folders ON DELETE CASCADE,
  vendor_name text NOT NULL,
  amount numeric(10, 2) NOT NULL,
  file_url text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage invoices of their own companies."
  ON public.invoices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.companies 
      WHERE companies.id = invoices.company_id 
      AND companies.user_id = auth.uid()
    )
  );

-- 4. Storage Bucket Instructions
-- In the Supabase dashboard, create a storage bucket named 'invoices', 
-- and allow authenticated users to Upload and Select objects.
