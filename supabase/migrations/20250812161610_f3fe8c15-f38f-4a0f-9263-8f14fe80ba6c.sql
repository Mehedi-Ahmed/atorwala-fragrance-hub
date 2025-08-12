
-- Drop the existing tables and recreate with a simplified structure
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;

-- Create a single comprehensive orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Customer details
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  special_notes TEXT,
  
  -- Product details (storing as individual rows for each product)
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  
  -- Pricing and discount details
  subtotal DECIMAL(10,2) NOT NULL, -- quantity * unit_price
  promo_code TEXT,
  discount_percentage DECIMAL(5,2) DEFAULT 0, -- e.g., 10.00 for 10%
  discount_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL, -- subtotal - discount_amount
  
  -- Order metadata
  order_number TEXT NOT NULL, -- Human-readable order identifier
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better performance
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_customer_phone ON public.orders(customer_phone);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public to create orders" 
  ON public.orders 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public to read orders" 
  ON public.orders 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'AW' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to validate and apply promo codes
CREATE OR REPLACE FUNCTION validate_promo_code(code TEXT)
RETURNS TABLE(is_valid BOOLEAN, discount_percent DECIMAL) AS $$
BEGIN
  -- Currently only supporting AW10 for 10% discount
  -- You can expand this later with a promo_codes table
  IF UPPER(code) = 'AW10' THEN
    RETURN QUERY SELECT TRUE::BOOLEAN, 10.00::DECIMAL;
  ELSE
    RETURN QUERY SELECT FALSE::BOOLEAN, 0.00::DECIMAL;
  END IF;
END;
$$ LANGUAGE plpgsql;
