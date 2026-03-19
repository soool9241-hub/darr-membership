import { useState } from "react";
import Modal from "./Modal";
import FormField from "./FormField";
import { supabase } from "../lib/supabase";

const TIER_CONFIG = {
  online: {
    title: "💻 온라인 멤버십 신청",
    grade: "달팽이 친구",
    desc: "주 1회 AI 자동화 경험 & 인사이트 공유",
    price: 9900,
    minMonths: 1,
    recurring: true,
    successMsg: "신청이 접수되었습니다!\n정기결제 안내를 카카오톡으로 드리겠습니다.",
  },
  offline: {
    title: "🔧 오프라인 멤버십 신청",
    grade: "달팽이 주민",
    desc: "월 1회 정기 · 100% 실습",
    price: 99000,
    minMonths: 3,
    recurring: true,
    successMsg: "신청이 접수되었습니다!\n정기결제 안내를 카카오톡으로 드리겠습니다.",
  },
  partner: {
    title: "🚀 파트너 멤버십 문의",
    grade: "달팽이 가족",
    desc: "월 4회 × 8시간 · 수익모델 + 마케팅 퍼널 구축",
    price: 990000,
    minMonths: 3,
    recurring: true,
    successMsg: "문의가 접수되었습니다!\n정기결제 안내를 카카오톡으로 드리겠습니다.",
  },
};

const MONTH_OPTIONS_1 = [
  { value: "1", label: "1개월 (정기결제)" },
  { value: "3", label: "3개월 (정기결제)" },
  { value: "6", label: "6개월 (정기결제)" },
  { value: "12", label: "12개월 (정기결제)" },
];

const MONTH_OPTIONS_3 = [
  { value: "3", label: "3개월 (정기결제)" },
  { value: "4", label: "4개월 (정기결제)" },
  { value: "5", label: "5개월 (정기결제)" },
  { value: "6", label: "6개월 (정기결제)" },
  { value: "12", label: "12개월 (정기결제)" },
];

const formatPrice = (n) => n.toLocaleString("ko-KR");

export default function MembershipApplyModal({ isOpen, onClose, tierId }) {
  const config = TIER_CONFIG[tierId] || TIER_CONFIG.online;

  const [form, setForm] = useState({
    name: "", email: "", phone: "", months: String(config.minMonths),
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const months = parseInt(form.months) || config.minMonths;
  const totalPrice = config.price * months;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "이름을 입력해주세요";
    if (!form.email.trim()) errs.email = "이메일을 입력해주세요";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "올바른 이메일 형식이 아닙니다";
    if (!form.phone.trim()) errs.phone = "연락처를 입력해주세요";
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
        const { error } = await supabase.from("membership_applications").insert({
          tier_id: tierId,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          months: months,
          total_price: totalPrice,
        });

        if (error) throw error;
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
    setForm({ name: "", email: "", phone: "", months: String(config.minMonths) });
    setErrors({});
    setSuccess(false);
    setSubmitError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={config.title}>
      {success ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
          <h4 style={{
            fontFamily: "'Noto Serif KR', serif", fontSize: "20px",
            fontWeight: 700, color: "#1B4332", marginBottom: "12px",
          }}>
            접수 완료
          </h4>
          <p style={{
            fontSize: "14px", color: "#5A6A5E", lineHeight: 1.7,
            marginBottom: "24px", whiteSpace: "pre-line",
          }}>
            {config.successMsg}
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => window.open("https://open.kakao.com/o/sool9241", "_blank")}
              style={{
                padding: "12px 24px", borderRadius: "10px",
                background: "#FEE500", color: "#3C1E1E",
                fontSize: "14px", fontWeight: 700,
                border: "none", cursor: "pointer",
              }}
            >
              💬 카카오톡 문의
            </button>
            <button onClick={handleClose} style={{
              padding: "12px 24px", borderRadius: "10px",
              background: "#F5F4EF", color: "#3A4A3E",
              fontSize: "14px", fontWeight: 600,
              border: "1px solid #E8E5DC", cursor: "pointer",
            }}>
              닫기
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p style={{ fontSize: "14px", color: "#6B7B6E", marginBottom: "8px", lineHeight: 1.6 }}>
            {config.desc}
          </p>
          <p style={{
            fontSize: "12px", color: "#5A6A5E", marginBottom: "20px",
            background: "#F0FAF4", padding: "8px 12px", borderRadius: "8px",
            lineHeight: 1.5,
          }}>
            신청 시 등급은 <strong style={{ color: "#1B4332" }}>Lv. {config.grade}</strong>로 표시됩니다.
          </p>

          <FormField label="이름" value={form.name} onChange={(v) => setField("name", v)} error={errors.name} required placeholder="홍길동" />
          <FormField label="이메일" type="email" value={form.email} onChange={(v) => setField("email", v)} error={errors.email} required placeholder="example@email.com" />
          <FormField label="연락처" type="tel" value={form.phone} onChange={(v) => setField("phone", v)} error={errors.phone} required placeholder="010-8531-9531" />

          <FormField
            label={`신청 개월 수 (최소 ${config.minMonths}개월)`}
            type="select"
            value={form.months}
            onChange={(v) => setField("months", v)}
            options={config.minMonths === 1 ? MONTH_OPTIONS_1 : MONTH_OPTIONS_3}
            required
          />

          <div style={{
            background: "linear-gradient(135deg, #F0FAF4, #E8F5EC)",
            borderRadius: "12px", padding: "16px", marginBottom: "16px",
            border: "1px solid #B7DEBF",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#5A6A5E" }}>
              <span>월 금액</span>
              <span>₩{formatPrice(config.price)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#5A6A5E" }}>
              <span>신청 기간</span>
              <span>{months}개월</span>
            </div>
            <div style={{ borderTop: "1px solid #B7DEBF", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#1B4332" }}>총 결제 금액</span>
              <span style={{ fontSize: "20px", fontWeight: 800, color: "#1B4332" }}>₩{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <p style={{ fontSize: "11px", color: "#8A9A8E", textAlign: "center", marginBottom: "16px", lineHeight: 1.5 }}>
            🔄 매월 자동 정기결제로 진행됩니다. 언제든 해지 가능합니다.
          </p>

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
              marginTop: "8px",
            }}
          >
            {loading ? "처리 중..." : `${months}개월 · ₩${formatPrice(totalPrice)} 신청하기`}
          </button>
        </form>
      )}
    </Modal>
  );
}
