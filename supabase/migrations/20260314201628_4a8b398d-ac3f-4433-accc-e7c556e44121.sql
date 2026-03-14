
-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled')),
  
  -- Customer details
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  
  -- Product specs
  design_id TEXT,
  design_name TEXT NOT NULL,
  design_image_url TEXT,
  dimensions TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  is_custom_design BOOLEAN NOT NULL DEFAULT false,
  custom_text TEXT,
  custom_font TEXT,
  custom_text_align TEXT,
  
  -- Pricing
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  
  -- Generated files
  order_form_url TEXT,
  print_file_url TEXT,
  
  -- Payment
  payment_provider TEXT DEFAULT 'grow',
  payment_transaction_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Admin-only access (for now, service role only via edge functions)
-- No public policies - orders are managed server-side

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generate sequential order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.orders;
  
  NEW.order_number := 'PZ-' || LPAD(next_num::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION public.generate_order_number();

-- Create storage bucket for order files
INSERT INTO storage.buckets (id, name, public) VALUES ('order-files', 'order-files', false);

-- Service role can manage all order files (edge functions use service role)
CREATE POLICY "Service role can manage order files"
  ON storage.objects FOR ALL
  USING (bucket_id = 'order-files')
  WITH CHECK (bucket_id = 'order-files');
