import { useState } from "react";
import Modal from "./Modal";
import FormField from "./FormField";
import { supabase } from "../lib/supabase";

const TIER_CONFIG = {
  online: {
    title: "💻 온라인 멤버십 신청",
    grade: "달팽이 친구",
    desc: "다양한 AI 자동화 & 수익화 구조를 알아봅니다",
    price: 9900,
    successMsg: "신청이 접수되었습니다!\n정기결제 안내를 카카오톡으로 드리겠습니다.",
  },
  offline: {
    title: "🔧 오프라인 멤버십 신청",
    grade: "달팽이 주민",
    desc: "AI 수익화 · 자동화 시스템을 만들어 봅니다",
    price: 99000,
    successMsg: "신청이 접수되었습니다!\n정기결제 안내를 카카오톡으로 드리겠습니다.",
  },
  partner: {
    title: "🚀 파트너 멤버십 문의",
    grade: "달팽이 가족",
    desc: "AI 수익화 · 자동화 시스템을 만들고 활용하여 지속 가능한 자동화 수익을 만들어봅니다!",
    price: 990000,
    successMsg: "문의가 접수되었습니다!\n정기결제 안내를 카카오톡으로 드리겠습니다.",
  },
};

const formatPrice = (n) => n.toLocaleString("ko-KR");

export default function MembershipApplyModal({ isOpen, onClose, tierId }) {
  const config = TIER_CONFIG[tierId] || TIER_CONFIG.online;

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

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
    setForm({ name: "", email: "", phone: "" });
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
            fontSize: "12px", color: "#5A6A5E", marginBottom: "16px",
            background: "#F0FAF4", padding: "8px 12px", borderRadius: "8px",
            lineHeight: 1.5,
          }}>
            신청 시 등급은 <strong style={{ color: "#1B4332" }}>Lv. {config.grade}</strong>로 표시됩니다.
          </p>

          <div style={{
            background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
            borderRadius: "12px", padding: "20px", marginBottom: "20px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "12px", color: "#95D5B2", marginBottom: "6px", letterSpacing: "0.1em" }}>월 정기결제</div>
            <div style={{ fontSize: "32px", fontWeight: 800, color: "#fff" }}>
              ₩{formatPrice(config.price)}<span style={{ fontSize: "15px", fontWeight: 500, color: "#B7E4C7" }}>/월</span>
            </div>
            <div style={{ fontSize: "11px", color: "#95D5B2", marginTop: "8px" }}>
              매월 자동결제 · 언제든 해지 가능
            </div>
          </div>

          <FormField label="이름" value={form.name} onChange={(v) => setField("name", v)} error={errors.name} required placeholder="홍길동" />
          <FormField label="이메일" type="email" value={form.email} onChange={(v) => setField("email", v)} error={errors.email} required placeholder="example@email.com" />
          <FormField label="연락처" type="tel" value={form.phone} onChange={(v) => setField("phone", v)} error={errors.phone} required placeholder="010-8531-9531" />

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
            {loading ? "처리 중..." : `₩${formatPrice(config.price)}/월 정기결제 신청`}
          </button>
        </form>
      )}
    </Modal>
  );
}
