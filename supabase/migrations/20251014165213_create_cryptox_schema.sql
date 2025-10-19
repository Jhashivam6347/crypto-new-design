/*
  # CryptoX Portal Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `role` (text: 'user', 'merchant', 'admin')
      - `kyc_status` (text: 'pending', 'approved', 'rejected')
      - `kyc_documents` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `crypto_holdings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `currency` (text: BTC, ETH, USDT, etc.)
      - `amount` (numeric)
      - `usd_value` (numeric)
      - `updated_at` (timestamptz)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text: deposit, withdrawal, payment, conversion)
      - `currency` (text)
      - `amount` (numeric)
      - `status` (text: pending, completed, failed)
      - `details` (jsonb)
      - `created_at` (timestamptz)
    
    - `wallet_addresses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `currency` (text)
      - `address` (text, unique)
      - `created_at` (timestamptz)
    
    - `payout_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `currency` (text)
      - `amount` (numeric)
      - `bank_details` (jsonb)
      - `status` (text: pending, approved, rejected, completed)
      - `admin_notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `merchant_payments`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, references profiles)
      - `amount` (numeric)
      - `currency` (text)
      - `payment_link` (text)
      - `status` (text)
      - `customer_email` (text)
      - `created_at` (timestamptz)
    
    - `loyalty_cashback`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `balance` (numeric, default 0)
      - `total_earned` (numeric, default 0)
      - `updated_at` (timestamptz)
    
    - `support_tickets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `subject` (text)
      - `description` (text)
      - `status` (text: open, pending, closed)
      - `assigned_to` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `audit_logs`
      - `id` (uuid, primary key)
      - `admin_id` (uuid, references profiles)
      - `action` (text)
      - `details` (jsonb)
      - `created_at` (timestamptz)
    
    - `system_config`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (jsonb)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for user, merchant, and admin access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'merchant', 'admin')),
  kyc_status text NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  kyc_documents jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Allow users to insert their own profile row
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);


-- Create crypto_holdings table
CREATE TABLE IF NOT EXISTS crypto_holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  currency text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  usd_value numeric NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, currency)
);

ALTER TABLE crypto_holdings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own holdings"
  ON crypto_holdings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own holdings"
  ON crypto_holdings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own holdings"
  ON crypto_holdings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'payment', 'conversion')),
  currency text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create wallet_addresses table
CREATE TABLE IF NOT EXISTS wallet_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  currency text NOT NULL,
  address text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, currency)
);

ALTER TABLE wallet_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet addresses"
  ON wallet_addresses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet addresses"
  ON wallet_addresses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create payout_requests table
CREATE TABLE IF NOT EXISTS payout_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  currency text NOT NULL,
  amount numeric NOT NULL,
  bank_details jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  admin_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payout requests"
  ON payout_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can insert own payout requests"
  ON payout_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update payout requests"
  ON payout_requests FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create merchant_payments table
CREATE TABLE IF NOT EXISTS merchant_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  currency text NOT NULL,
  payment_link text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  customer_email text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE merchant_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own payments"
  ON merchant_payments FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Merchants can insert own payments"
  ON merchant_payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id);

-- Create loyalty_cashback table
CREATE TABLE IF NOT EXISTS loyalty_cashback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  balance numeric NOT NULL DEFAULT 0,
  total_earned numeric NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE loyalty_cashback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loyalty cashback"
  ON loyalty_cashback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own loyalty cashback"
  ON loyalty_cashback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'closed')),
  assigned_to uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can insert own tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update tickets"
  ON support_tickets FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = admin_id AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create system_config table
CREATE TABLE IF NOT EXISTS system_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view system config"
  ON system_config FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update system config"
  ON system_config FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status ON payout_requests(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);