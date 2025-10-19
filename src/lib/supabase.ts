import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  username: string;
  role: 'user' | 'merchant' | 'admin';
  kyc_status: 'pending' | 'approved' | 'rejected';
  kyc_documents?: any;
  created_at: string;
  updated_at: string;
}

export interface CryptoHolding {
  id: string;
  user_id: string;
  currency: string;
  amount: number;
  usd_value: number;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'conversion';
  currency: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  details?: any;
  created_at: string;
}

export interface PayoutRequest {
  id: string;
  user_id: string;
  currency: string;
  amount: number;
  bank_details: any;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'pending' | 'closed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}
