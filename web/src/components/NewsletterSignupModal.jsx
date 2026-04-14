import { useState } from "react";
import Modal from "./Modal";
import FormField from "./FormField";
import { supabase, getUTMParams, getReferralCode } from "../lib/supabase";

const WAITLIST_PRODUCTS = [
  { id: "sns", name: "SNS 자동 포스팅 시스템", emoji: "📱", price: "월 99,000원", yearPrice: 1188000 },
  { id: "crm", name: "고객 CRM 자동 관리", emoji: "👥", price: "월 99,000원", yearPrice: 1188000 },
  { id: "booking", name: "온라인 예약 페이지 빌더", emoji: "🗓️", price: "월 99,000원", yearPrice: 1188000 },
  { id: "checklist", name: "직원 업무 체크리스트 자동화", emoji: "✅", price: "월 99,000원", yearPrice: 1188000 },
  { id: "accounting", name: "정산/세금 자동 리포트", emoji: "💰", price: "월 99,000원", yearPrice: 1188000 },
  { id: "coupon", name: "쿠폰/프로모션 자동 발송", emoji: "🎁", price: "월 99,000원", yearPrice: 1188000 },
];

const formatPrice = (n) => n.toLocaleString();

export default function NewsletterSignupModal({ isOpen, onClose, onSwitchTier, waitlistMode = false }) {
  const [form, setForm] = useState({ email: "", name: "", phone: "" });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showNudge, setShowNudge] = useState(false);

  const toggleProduct = (id) => setSelectedProducts(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const yearTotal = selectedProducts.length * 1188000;

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "이메일을 입력해주세요";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "올바른 이메일 형식이 아닙니다";
    return errs;
  };

  const doSubmit = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      if (supabase) {
        const utm = getUTMParams();
        const referralCode = getReferralCode();
        const interestProducts = selectedProducts.length > 0
          ? selectedProducts.map(id => WAITLIST_PRODUCTS.find(p => p.id === id)?.name).filter(Boolean).join(", ")
          : null;
        const { error } = await supabase.from("subscribers").insert({
          email: form.email.trim().toLowerCase(),
          name: form.name.trim() || null,
          phone: form.phone.trim() || null,
          referral_code: referralCode,
          interest_products: interestProducts,
          ...utm,
        });
        if (error) {
          if (error.code === "23505") { setSuccess(true); return; }
          throw error;
        }
      }
      setSuccess(true);
    } catch (err) {
      setSubmitError("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // 선택한 상품이 있고 아직 넛지를 안 보여줬으면 → 아카데미 유도
    if (waitlistMode && selectedProducts.length > 0 && !showNudge) {
      setShowNudge(true);
      return;
    }

    await doSubmit();
  };

  const handleClose = () => {
    setForm({ email: "", name: "", phone: "" });
    setSelectedProducts([]);
    setErrors({});
    setSuccess(false);
    setSubmitError("");
    setShowNudge(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={waitlistMode ? "📋 대기자 명단 등록" : "📬 달팽이레터 구독"}>
      {success ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>{waitlistMode ? "🎉" : "🐌"}</div>
          <h4 style={{
            fontFamily: "'Noto Serif KR', serif", fontSize: "20px",
            fontWeight: 700, color: "#1B4332", marginBottom: "12px",
          }}>
            {waitlistMode ? "대기자 등록 완료!" : "구독 완료!"}
          </h4>
          <p style={{ fontSize: "14px", color: "#5A6A5E", lineHeight: 1.7, marginBottom: "24px" }}>
            {waitlistMode ? (<>관심 상품 런칭 시 가장 먼저 알림 드리겠습니다!<br />달팽이레터도 함께 구독되었습니다.</>) : (<>다음 달팽이레터를 기대해주세요.<br />매주 화·목, 최신 AI 트렌드를 전해드립니다.</>)}
          </p>
          <button onClick={handleClose} style={{
            padding: "12px 32px", borderRadius: "10px",
            background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
            color: "#fff", fontSize: "15px", fontWeight: 700,
            border: "none", cursor: "pointer",
          }}>확인</button>
        </div>
      ) : showNudge ? (
        /* 아카데미 유도 화면 — 좌우 비교 */
        <div style={{ padding: "10px 0" }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#1B4332", textAlign: "center", marginBottom: "16px" }}>
            잠깐, 비교해보세요!
          </div>

          {/* 좌우 비교 카드 — 3년 기준 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
            {/* 구독 3년 */}
            <div style={{
              background: "#F5F4EF", borderRadius: "12px", padding: "16px",
              border: "1px solid #E8E5DC", textAlign: "center",
            }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#8A9A8E", marginBottom: "8px" }}>구독으로 사기 (3년)</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#D32F2F", marginBottom: "4px" }}>
                ₩{formatPrice(yearTotal * 3)}
              </div>
              <div style={{ fontSize: "11px", color: "#8A9A8E", marginBottom: "12px" }}>₩{formatPrice(yearTotal)}/년 × 3년</div>
              <div style={{ fontSize: "11px", color: "#6B7B6E", lineHeight: 1.6, textAlign: "left" }}>
                ✗ {selectedProducts.length}개 시스템만<br />
                ✗ 3년간 매년 갱신 결제<br />
                ✗ 해지하면 끝<br />
                ✗ 커스터마이징 불가
              </div>
            </div>

            {/* 아카데미 */}
            <div style={{
              background: "linear-gradient(135deg, #1B4332, #2D6A4F)", borderRadius: "12px", padding: "16px",
              textAlign: "center", position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "0", right: "0",
                background: "#FF6B35", color: "#fff", fontSize: "9px", fontWeight: 800,
                padding: "3px 10px", borderRadius: "0 12px 0 8px",
              }}>추천</div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#95D5B2", marginBottom: "8px" }}>직접 만들기 (평생)</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "4px" }}>
                ₩990,000
              </div>
              <div style={{ fontSize: "11px", color: "#95D5B2", marginBottom: "12px" }}>딱 1번 · 이후 0원</div>
              <div style={{ fontSize: "11px", color: "#B7E4C7", lineHeight: 1.6, textAlign: "left" }}>
                ✓ 6개 시스템 전부<br />
                ✓ 평생 소유 · 추가비용 0<br />
                ✓ 내 사업 맞춤 커스텀<br />
                ✓ 코칭프로 자격 + 수익쉐어
              </div>
            </div>
          </div>

          {/* 3년 절약 금액 강조 */}
          <div style={{
            background: "#FFF8F0", borderRadius: "10px", padding: "14px 16px",
            textAlign: "center", marginBottom: "16px",
            border: "1px solid #FFD9B8",
          }}>
            <div style={{ fontSize: "12px", color: "#854F0B", marginBottom: "6px" }}>
              3년 기준 아카데미가
            </div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#E85D26" }}>
              ₩{formatPrice(yearTotal * 3 - 990000)} 저렴
            </div>
            <div style={{ fontSize: "11px", color: "#854F0B", marginTop: "6px", lineHeight: 1.5 }}>
              구독 3년 = ₩{formatPrice(yearTotal * 3)} vs 아카데미 = ₩990,000
            </div>
          </div>

          <button
            onClick={() => { handleClose(); onSwitchTier && onSwitchTier("partner"); }}
            style={{
              width: "100%", padding: "14px", borderRadius: "12px",
              background: "linear-gradient(135deg, #FF6B35, #E85D26)",
              color: "#fff", fontSize: "15px", fontWeight: 800,
              border: "none", cursor: "pointer", marginBottom: "10px",
            }}
          >🎓 퍼널구축 아카데미 알아보기</button>

          <button
            onClick={doSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "12px", borderRadius: "12px",
              background: "transparent",
              color: "#8A9A8E", fontSize: "13px", fontWeight: 500,
              border: "1px solid #E8E5DC", cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "처리 중..." : "괜찮아요, 대기자 등록만 할게요"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p style={{ fontSize: "14px", color: "#6B7B6E", marginBottom: "20px", lineHeight: 1.6 }}>
            {waitlistMode
              ? "관심 있는 상품을 선택하고 등록하시면, 런칭 시 가장 먼저 알림 드립니다."
              : "무료로 주 2회, 최신 AI 자동화 트렌드를 받아보세요."}
          </p>

          {waitlistMode && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#3A4A3E", marginBottom: "10px" }}>
                관심 상품 선택 <span style={{ fontSize: "11px", color: "#8A9A8E", fontWeight: 400 }}>(선택 · 복수 가능)</span>
              </div>
              <div style={{ maxHeight: "280px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
                {WAITLIST_PRODUCTS.map((prod) => {
                  const checked = selectedProducts.includes(prod.id);
                  return (
                    <label
                      key={prod.id}
                      onClick={() => toggleProduct(prod.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
                        border: checked ? "2px solid #52B788" : "1.5px solid #E8E5DC",
                        background: checked ? "#F0FAF4" : "#FAFAF7",
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        style={{ accentColor: "#2D6A4F", width: "16px", height: "16px", flexShrink: 0 }}
                      />
                      <span style={{ fontSize: "14px" }}>{prod.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: "13px", fontWeight: checked ? 600 : 500, color: checked ? "#1B4332" : "#5A6A5E" }}>
                          {prod.name}
                        </span>
                        <span style={{ fontSize: "11px", color: "#8A9A8E", marginLeft: "6px" }}>{prod.price}</span>
                      </div>
                      <span style={{
                        fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px",
                        color: "#fff", background: "#D32F2F",
                      }}>SOLD OUT</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <FormField
            label="이메일"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            error={errors.email}
            required
            placeholder="example@email.com"
          />
          <FormField
            label="이름"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            placeholder="홍길동 (선택)"
          />
          <FormField
            label="연락처"
            type="tel"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
            placeholder="010-8531-9531 (선택)"
          />

          {submitError && (
            <div style={{
              background: "#FFF3F3", color: "#D32F2F", padding: "10px 14px",
              borderRadius: "8px", fontSize: "13px", marginBottom: "16px",
            }}>
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "14px", borderRadius: "12px",
              background: loading ? "#95D5B2" : "linear-gradient(135deg, #1B4332, #2D6A4F)",
              color: "#fff", fontSize: "15px", fontWeight: 700,
              border: "none", cursor: loading ? "wait" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "처리 중..." : waitlistMode ? "📋 대기자 등록 + 달팽이레터 구독" : "🐌 무료 구독하기"}
          </button>
        </form>
      )}
    </Modal>
  );
}
