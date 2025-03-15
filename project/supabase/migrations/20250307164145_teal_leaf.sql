/*
  # Initial Schema Setup for Service Marketplace

  1. Tables
    - users (extends auth.users)
      - role, name, phone number
    - shops
      - basic shop information and location
    - services
      - services offered by shops
    - service_requests
      - customer service requests and tracking
    
  2. Security
    - RLS policies for each table
    - Role-based access control
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'shopkeeper', 'delivery');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'assigned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed');
CREATE TYPE payment_method AS ENUM ('upi', 'card', 'wallet', 'cash');

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role user_role NOT NULL,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create shops table
CREATE TABLE IF NOT EXISTS public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.users(id),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  estimated_time INTEGER NOT NULL, -- in minutes
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create service_requests table
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.users(id),
  shop_id UUID NOT NULL REFERENCES public.shops(id),
  service_id UUID NOT NULL REFERENCES public.services(id),
  delivery_person_id UUID REFERENCES public.users(id),
  status request_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  payment_method payment_method,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Shops policies
CREATE POLICY "Anyone can view active shops"
  ON public.shops
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Shopkeepers can manage their shops"
  ON public.shops
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

-- Services policies
CREATE POLICY "Anyone can view active services"
  ON public.services
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Shopkeepers can manage their services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = services.shop_id
      AND shops.owner_id = auth.uid()
    )
  );

-- Service requests policies
CREATE POLICY "Customers can view their requests"
  ON public.service_requests
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Shopkeepers can view requests for their shops"
  ON public.service_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = service_requests.shop_id
      AND shops.owner_id = auth.uid()
    )
  );

CREATE POLICY "Delivery personnel can view assigned requests"
  ON public.service_requests
  FOR SELECT
  TO authenticated
  USING (delivery_person_id = auth.uid());

CREATE POLICY "Customers can create requests"
  ON public.service_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, role, name, phone)
  VALUES (new.id, 'customer', '', '');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();