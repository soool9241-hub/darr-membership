-- ══════════════════════════════════════════════
-- 달팽이 멤버십 — S2.5 미니 워크샵 + 코드 동기화
-- 2026-04-14
--
-- 실행 방법:
--   Supabase Dashboard → SQL Editor → 붙여넣기 → Run
-- ══════════════════════════════════════════════

BEGIN;

-- ─────────────────────────────────────────────
-- 1. mini-workshop 티어 추가
-- ─────────────────────────────────────────────
INSERT INTO tiers (id, name, price_monthly, min_commitment_months, max_seats, is_active) VALUES
  ('mini-workshop', '미니 바이브코딩 워크샵', 100000, 0, 10, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name                  = EXCLUDED.name,
  price_monthly         = EXCLUDED.price_monthly,
  min_commitment_months = EXCLUDED.min_commitment_months,
  max_seats             = EXCLUDED.max_seats,
  is_active             = EXCLUDED.is_active;

-- ─────────────────────────────────────────────
-- 2. 레거시 'offline' 티어 참조 정리
--    (코드가 bootcamp/pro → 'offline' 로 잘못 저장한 기존 레코드)
-- ─────────────────────────────────────────────
UPDATE membership_applications
   SET tier_id = 'partner'
 WHERE tier_id = 'offline';

-- ─────────────────────────────────────────────
-- 3. 검증 쿼리 (주석 해제해서 따로 실행)
-- ─────────────────────────────────────────────
-- SELECT id, name, price_monthly, max_seats FROM tiers ORDER BY price_monthly;
-- SELECT tier_id, count(*) FROM membership_applications GROUP BY tier_id;

COMMIT;
