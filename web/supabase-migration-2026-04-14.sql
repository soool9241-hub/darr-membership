-- ══════════════════════════════════════════════
-- 달팽이 멤버십 — 상품 구조 재정리
-- 2026-04-14 (revised)
--
-- 시장조사 결과 S2.5 미니 워크샵은 삭제.
-- 동일 내용은 S3 원데이 세미나 "팔리는 랜딩페이지 구축" 과목이 커버.
--
-- 실행 방법:
--   Supabase Dashboard → SQL Editor → 붙여넣기 → Run
-- ══════════════════════════════════════════════

BEGIN;

-- ─────────────────────────────────────────────
-- 1. mini-workshop 티어 비활성화 (데이터 보존 위해 soft delete)
--    이전 세션에서 INSERT 했을 수 있으므로 안전하게 처리
-- ─────────────────────────────────────────────
UPDATE tiers SET is_active = FALSE WHERE id = 'mini-workshop';

-- 실제로 아직 관련 신청 레코드가 없으면 hard delete 도 가능:
-- DELETE FROM tiers WHERE id = 'mini-workshop';

-- ─────────────────────────────────────────────
-- 2. 레거시 'offline' 티어 참조 정리
--    코드가 bootcamp/pro → 'offline' 로 잘못 저장한 기존 레코드
-- ─────────────────────────────────────────────
UPDATE membership_applications
   SET tier_id = 'partner'
 WHERE tier_id = 'offline';

-- ─────────────────────────────────────────────
-- 3. 검증 쿼리 (주석 해제해서 따로 실행)
-- ─────────────────────────────────────────────
-- SELECT id, name, price_monthly, max_seats, is_active FROM tiers ORDER BY price_monthly;
-- SELECT tier_id, count(*) FROM membership_applications GROUP BY tier_id;

COMMIT;
