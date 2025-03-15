export type UserRole = 'customer' | 'shopkeeper' | 'delivery';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone: string;
  created_at: string;
}

export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Service {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  price: number;
  estimated_time: number;
  status: 'active' | 'inactive';
}

export interface ServiceRequest {
  id: string;
  customer_id: string;
  shop_id: string;
  service_id: string;
  delivery_person_id: string | null;
  status: 'pending' | 'accepted' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'completed';
  payment_method: 'upi' | 'card' | 'wallet' | 'cash';
  amount: number;
  created_at: string;
}