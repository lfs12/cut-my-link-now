-- Create URLs table
CREATE TABLE IF NOT EXISTS public.urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days')
);

-- Enable RLS
ALTER TABLE public.urls ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert URLs (public service)
CREATE POLICY "Anyone can create short URLs"
  ON public.urls
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read URLs
CREATE POLICY "Anyone can read URLs"
  ON public.urls
  FOR SELECT
  USING (true);

-- Allow anyone to update click counts
CREATE POLICY "Anyone can update click counts"
  ON public.urls
  FOR UPDATE
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_urls_short_code ON public.urls(short_code);
CREATE INDEX idx_urls_expires_at ON public.urls(expires_at);

-- Create function to generate random short codes
CREATE OR REPLACE FUNCTION generate_short_code(length INTEGER DEFAULT 7)
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create statistics table for realtime tracking
CREATE TABLE IF NOT EXISTS public.site_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_urls INTEGER DEFAULT 0,
  online_users INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for stats
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read stats
CREATE POLICY "Anyone can read stats"
  ON public.site_stats
  FOR SELECT
  USING (true);

-- Allow anyone to update stats
CREATE POLICY "Anyone can update stats"
  ON public.site_stats
  FOR UPDATE
  USING (true);

-- Insert initial stats row
INSERT INTO public.site_stats (total_urls, online_users) VALUES (0, 0);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.urls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_stats;