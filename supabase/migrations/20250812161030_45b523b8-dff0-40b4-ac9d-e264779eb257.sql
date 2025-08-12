
-- Create orders table to store customer information and order details
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  special_notes TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table to store individual products in each order
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- Enable Row Level Security (since this is a public-facing order system, we'll allow public access)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access for order creation and admin access for management
CREATE POLICY "Allow public to create orders" 
  ON public.orders 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public to create order items" 
  ON public.order_items 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Add policies for reading orders (you can modify these later for admin access)
CREATE POLICY "Allow public to read orders" 
  ON public.orders 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public to read order items" 
  ON public.order_items 
  FOR SELECT 
  TO anon, authenticated
  USING (true);
