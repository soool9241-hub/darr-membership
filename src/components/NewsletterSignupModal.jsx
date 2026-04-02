import { useState } from "react";
import Modal from "./Modal";
import FormField from "./FormField";
import { supabase, getUTMParams, getReferralCode } from "../lib/supabase";

const WAITLIST_PRODUCTS = [
  { id: "n8n_vod", name: "n8n 자동화 입문 (VOD)", emoji: "🎬" },
  { id: "ai_vod", name: "소상공인 AI 실전 활용 (VOD)", emoji: "🎬" },
  { id: "supabase_vod", name: "Supabase 예약 시스템 (VOD)", emoji: "🎬" },
  { id: "marketing_vod", name: "마케팅 자동화 마스터 (VOD)", emoji: "🎬" },
  { id: "agent_vod", name: "AI 에이전트 설계 실전 (VOD)", emoji: "🎬" },
  { id: "sms_pack", name: "SMS 자동 발송 스타터 팩", emoji: "📦" },
  { id: "booking_pack", name: "예약 관리 올인원 팩", emoji: "📦" },
  { id: "sns_pack", name: "SNS 콘텐츠 자동화 팩", emoji: "📦" },
  { id: "funnel_pack", name: "매출 2배 퍼널 템플릿", emoji: "📦" },
  { id: "crm_pack", name: "고객 관리 CRM 올인원 팩", emoji: "📦" },
  { id: "workshop", name: "AI 자동화 체험 워크샵 (기업)", emoji: "🏫" },
  { id: "corp_edu", name: "업무 자동화 실전 교육 (기업)", emoji: "🏫" },
];

export default function NewsletterSignupModal({ isOpen, onClose, waitlistMode = false }) {
  const [form, setForm] = useState({ email: "", name: "", phone: "" });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const toggleProduct = (id) => setSelectedProducts(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "이메일을 입력해주세요";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "올바른 이메일 형식이 아닙니다";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setSubmitError("");

    try {
      if (supabase) {
        const utm = getUTMParams();
        const referralCode = getReferralCode();

        const interestProducts = waitlistMode && selectedProducts.length > 0
          ? selectedProducts.map(id => WAITLIST_PRODUCTS.find(p => p.id === id)?.name).filter(Boolean).join(", ")
          : null;
        const { error } = await supabase.from("subscribers").insert({
          email: form.email.trim().toLowerCase(),
          name: form.name.trim() || null,
          phone: form.phone.trim() || null,
          referral_code: referralCode,
          admin_notes: interestProducts ? `관심 상품: ${interestProducts}` : null,
          ...utm,
        });

        if (error) {
          if (error.code === "23505") {
            setSuccess(true);
            return;
          }
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

  const handleClose = () => {
    setForm({ email: "", name: "", phone: "" });
    setSelectedProducts([]);
    setErrors({});
    setSuccess(false);
    setSubmitError("");
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
          }}>
            확인
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
                관심 상품 선택 <span style={{ fontSize: "11px", color: "#8A9A8E", fontWeight: 400 }}>(복수 선택 가능)</span>
              </div>
              <div style={{ maxHeight: "240px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
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
                      <span style={{ fontSize: "13px", fontWeight: checked ? 600 : 500, color: checked ? "#1B4332" : "#5A6A5E" }}>
                        {prod.name}
                      </span>
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
            {loading ? "처리 중..." : waitlistMode ? "📋 대기자 등록 + 뉴스레터 구독" : "🐌 무료 구독하기"}
          </button>
        </form>
      )}
    </Modal>
  );
}
