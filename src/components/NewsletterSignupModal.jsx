import { useState } from "react";
import Modal from "./Modal";
import FormField from "./FormField";
import { supabase, getUTMParams, getReferralCode } from "../lib/supabase";

export default function NewsletterSignupModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ email: "", name: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

        const { error } = await supabase.from("subscribers").insert({
          email: form.email.trim().toLowerCase(),
          name: form.name.trim() || null,
          phone: form.phone.trim() || null,
          referral_code: referralCode,
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
    setErrors({});
    setSuccess(false);
    setSubmitError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="📬 달팽이레터 구독">
      {success ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🐌</div>
          <h4 style={{
            fontFamily: "'Noto Serif KR', serif", fontSize: "20px",
            fontWeight: 700, color: "#1B4332", marginBottom: "12px",
          }}>
            구독 완료!
          </h4>
          <p style={{ fontSize: "14px", color: "#5A6A5E", lineHeight: 1.7, marginBottom: "24px" }}>
            다음 달팽이레터를 기대해주세요.<br />
            매주 화·목, 최신 AI 트렌드를 전해드립니다.
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
            무료로 주 2회, 최신 AI 자동화 트렌드를 받아보세요.
          </p>

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
            placeholder="010-0000-0000 (선택)"
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
            {loading ? "처리 중..." : "🐌 무료 구독하기"}
          </button>
        </form>
      )}
    </Modal>
  );
}
