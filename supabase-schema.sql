-- ══════════════════════════════════════════════
-- 달팽이 멤버십 스터디 — Supabase Schema
-- ══════════════════════════════════════════════

-- 1. 멤버십 티어 (참조 테이블)
CREATE TABLE tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL,
  min_commitment_months INTEGER NOT NULL DEFAULT 0,
  max_seats INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO tiers (id, name, price_monthly, min_commitment_months, max_seats) VALUES
  ('letter', '달팽이레터', 0, 0, NULL),
  ('online', '온라인 멤버십', 9900, 0, 1000),
  ('offline', '오프라인 멤버십', 99000, 3, 20),
  ('partner', '파트너 멤버십', 990000, 3, 20);

-- 2. 뉴스레터 구독자
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT TRUE,
  unsubscribed_at TIMESTAMPTZ,
  referral_code TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_referral ON subscribers(referral_code);

-- 3. 멤버십 신청 (유료 티어)
CREATE TABLE membership_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id TEXT NOT NULL REFERENCES tiers(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  months INTEGER NOT NULL DEFAULT 3,
  total_price INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX idx_applications_status ON membership_applications(status);
CREATE INDEX idx_applications_tier ON membership_applications(tier_id);

-- 4. 활성 멤버
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES membership_applications(id),
  tier_id TEXT NOT NULL REFERENCES tiers(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  commitment_end_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  cancelled_at TIMESTAMPTZ,
  referred_by_partner_id UUID,
  referral_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_members_tier ON members(tier_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_email ON members(email);

-- 5. 결제 내역
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id),
  tier_id TEXT NOT NULL REFERENCES tiers(id),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'KRW',
  payment_method TEXT,
  pg_transaction_id TEXT,
  pg_provider TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  billing_period_start DATE,
  billing_period_end DATE,
  referral_commission_amount INTEGER DEFAULT 0,
  referral_commission_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX idx_payments_member ON payments(member_id);
CREATE INDEX idx_payments_status ON payments(status);

-- 6. 파트너 (수익 분배 시스템)
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  commission_rate NUMERIC(5,2) NOT NULL DEFAULT 40.00,
  total_referrals INTEGER DEFAULT 0,
  active_referrals INTEGER DEFAULT 0,
  total_earnings INTEGER DEFAULT 0,
  pending_payout INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_partners_referral_code ON partners(referral_code);

-- 7. 수익 분배 내역
CREATE TABLE referral_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  payment_id UUID NOT NULL REFERENCES payments(id),
  referred_member_id UUID NOT NULL REFERENCES members(id),
  commission_rate NUMERIC(5,2) NOT NULL,
  base_amount INTEGER NOT NULL,
  commission_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_commissions_partner ON referral_commissions(partner_id);
CREATE INDEX idx_commissions_status ON referral_commissions(status);

-- 8. 일반 문의
CREATE TABLE contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  inquiry_type TEXT DEFAULT 'general',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════ RLS 정책 ══════
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read own" ON subscribers FOR SELECT USING (true);

ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply" ON membership_applications FOR INSERT WITH CHECK (true);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can inquire" ON contact_inquiries FOR INSERT WITH CHECK (true);
