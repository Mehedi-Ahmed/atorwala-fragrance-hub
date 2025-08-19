
-- Update the products in the database (assuming we have a products table or need to create one)
-- Since the current system uses hardcoded products, I'll create a products table for better management

CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT,
  target_audience TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the new products
INSERT INTO public.products (id, name, description, price, target_audience) VALUES
('mystic-blossom', 'Mystic Blossom', 'A delicate and enchanting fragrance with floral notes that bloom beautifully on the skin. This exquisite attar is specially crafted with feminine elegance in mind, making it the perfect choice for girls who appreciate sophisticated and graceful scents.', 250, 'girls'),
('sapphire-sand', 'Sapphire Sand', 'A bold and mysterious fragrance that captures the essence of desert winds and precious gems. This masculine scent combines earthy undertones with luxurious depth, making it an excellent choice for men who want to make a lasting impression.', 250, 'men'),
('raw-pulse', 'Raw Pulse', 'An intense and dynamic fragrance that embodies raw energy and power. This commanding attar delivers a strong, masculine presence with bold notes that resonate confidence, perfect for men who embrace their inner strength.', 250, 'men')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  target_audience = EXCLUDED.target_audience,
  updated_at = NOW();

-- Enable RLS for products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to products
CREATE POLICY "Allow public read access to products" 
  ON public.products 
  FOR SELECT 
  USING (true);
