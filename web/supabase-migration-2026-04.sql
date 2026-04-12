-- ══════════════════════════════════════════════
-- 달팽이 멤버십 — 사이트 구조 동기화 마이그레이션
-- 2026-04-12
--
-- 실행 방법:
--   Supabase Dashboard → SQL Editor → 아래 전체 붙여넣기 → Run
--   (이미 적용된 부분은 IF EXISTS / ON CONFLICT 로 건너뜀)
-- ══════════════════════════════════════════════

BEGIN;

-- ─────────────────────────────────────────────
-- 1. tiers 테이블 현행화
--    기존: letter / online(9,900) / offline(99,000) / partner(990,000)
--    신규: letter / online(30,000) / pro(300,000) / partner(990,000)
-- ─────────────────────────────────────────────

-- 구버전 offline 티어가 있으면 pro로 대체
DELETE FROM tiers WHERE id = 'offline';

-- 신규/변경 티어 upsert
INSERT INTO tiers (id, name, price_monthly, min_commitment_months, max_seats, is_active) VALUES
  ('letter',  '달팽이레터',         0,      0, NULL, TRUE),
  ('online',  '온라인 멤버십',      30000,  0, 1000, TRUE),
  ('pro',     '온라인 원데이 세미나', 300000, 0, NULL, TRUE),
  ('partner', '퍼널구축 아카데미',   990000, 0, 30,   TRUE)
ON CONFLICT (id) DO UPDATE SET
  name                  = EXCLUDED.name,
  price_monthly         = EXCLUDED.price_monthly,
  min_commitment_months = EXCLUDED.min_commitment_months,
  max_seats             = EXCLUDED.max_seats,
  is_active             = EXCLUDED.is_active;

-- ─────────────────────────────────────────────
-- 2. membership_applications 에 폼 필드 추가
--    (현재 코드는 admin_notes 에 병합 저장 중 — 이제 정식 컬럼으로)
-- ─────────────────────────────────────────────
ALTER TABLE membership_applications
  ADD COLUMN IF NOT EXISTS occupation TEXT,
  ADD COLUMN IF NOT EXISTS motivation TEXT;

-- ─────────────────────────────────────────────
-- 3. subscribers (대기자/뉴스레터) 확장
--    선택 상품 목록 + 3년 비교 넛지 결과 추적용
-- ─────────────────────────────────────────────
ALTER TABLE subscribers
  ADD COLUMN IF NOT EXISTS selected_products TEXT,   -- JSON 문자열 or CSV
  ADD COLUMN IF NOT EXISTS nudge_outcome TEXT;       -- 'academy_switch' | 'waitlist_only' | NULL

-- ─────────────────────────────────────────────
-- 4. 자동화 시스템 구독 대기자 테이블 (신규)
--    현재 6종 상품 전부 SOLD OUT — 재오픈 시 우선 안내용
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  product_keys TEXT NOT NULL,          -- 'sns,crm,booking' 같은 CSV
  year_total INTEGER,                  -- 선택 상품 연 구독 합계
  converted_to_academy BOOLEAN DEFAULT FALSE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_waitlist_email ON product_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_product_waitlist_converted ON product_waitlist(converted_to_academy);

-- ─────────────────────────────────────────────
-- 5. RLS (Row Level Security) — anon insert 허용
--    랜딩페이지에서 바로 insert 할 수 있도록
-- ─────────────────────────────────────────────
ALTER TABLE subscribers               ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_applications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_waitlist          ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon insert subscribers"            ON subscribers;
DROP POLICY IF EXISTS "anon insert membership_applications" ON membership_applications;
DROP POLICY IF EXISTS "anon insert product_waitlist"        ON product_waitlist;

CREATE POLICY "anon insert subscribers"
  ON subscribers FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon insert membership_applications"
  ON membership_applications FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon insert product_waitlist"
  ON product_waitlist FOR INSERT TO anon WITH CHECK (true);

-- 읽기는 service_role 만 (기본값) — 별도 policy 없음

COMMIT;

-- ══════════════════════════════════════════════
-- 검증 쿼리 (실행 후 확인용 — 주석 해제하여 따로 실행)
-- ══════════════════════════════════════════════
-- SELECT id, name, price_monthly, max_seats FROM tiers ORDER BY price_monthly;
-- SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_name = 'membership_applications';
-- SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_name = 'subscribers';
-- SELECT * FROM product_waitlist LIMIT 1;
