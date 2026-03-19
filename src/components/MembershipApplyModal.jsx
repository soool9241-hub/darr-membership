import { useState } from "react";
import Modal from "./Modal";
import FormField from "./FormField";
import { supabase, getReferralCode } from "../lib/supabase";

const TIER_CONFIG = {
  online: {
    title: "💻 온라인 멤버십 신청",
    desc: "매주 2시간 라이브 시연 · ₩9,900/월",
    successMsg: "신청이 접수되었습니다!\n카카오톡으로 결제 안내를 드리겠습니다.",
    showBusiness: false,
    showCommitment: false,
  },
  offline: {
    title: "🔧 오프라인 멤버십 신청",
    desc: "월 1회 오프라인 원데이 · ₩99,000/월 · 최소 3개월",
    successMsg: "신청이 접수되었습니다!\n검토 후 개별 안내 드리겠습니다.",
    showBusiness: true,
    showCommitment: true,
  },
  partner: {
    title: "🚀 파트너 멤버십 문의",
    desc: "주 1회 8시간 밀착 세션 · ₩990,000/월 · 최소 3개월",
    successMsg: "문의가 접수되었습니다!\n1:1 상담을 위해 연락드리겠습니다.",
    showBusiness: true,
    showCommitment: true,
  },
};

const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "입문 — AI 도구를 거의 써본 적 없음" },
  { value: "intermediate", label: "중급 — ChatGPT 등 기본 도구 사용 경험" },
  { value: "advanced", label: "고급 — n8n, API 연동 등 자동화 경험 있음" },
];

const HOW_FOUND_OPTIONS = [
  { value: "search", label: "검색 (구글/네이버)" },
  { value: "sns", label: "SNS (인스타/유튜브/블로그)" },
  { value: "referral", label: "지인 소개" },
  { value: "newsletter", label: "달팽이레터" },
  { value: "other", label: "기타" },
];

export default function MembershipApplyModal({ isOpen, onClose, tierId }) {
  const config = TIER_CONFIG[tierId] || TIER_CONFIG.online;

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    business_type: "", goal: "", experience_level: "",
    how_found: "", referral_code: getReferralCode() || "",
    agree_commitment: false, agree_terms: false,
  });
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
    if (config.showBusiness && !form.goal.trim()) errs.goal = "목표를 입력해주세요";
    if (!form.agree_terms) errs.agree_terms = "개인정보 수집에 동의해주세요";
    if (config.showCommitment && !form.agree_commitment) errs.agree_commitment = "최소 약정에 동의해주세요";
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
          business_type: form.business_type.trim() || null,
          goal: form.goal.trim() || null,
          experience_level: form.experience_level || null,
          how_found: form.how_found || null,
          referral_code: form.referral_code.trim() || null,
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
    setForm({
      name: "", email: "", phone: "",
      business_type: "", goal: "", experience_level: "",
      how_found: "", referral_code: getReferralCode() || "",
      agree_commitment: false, agree_terms: false,
    });
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
          <p style={{ fontSize: "14px", color: "#6B7B6E", marginBottom: "20px", lineHeight: 1.6 }}>
            {config.desc}
          </p>

          <FormField label="이름" value={form.name} onChange={(v) => setField("name", v)} error={errors.name} required placeholder="홍길동" />
          <FormField label="이메일" type="email" value={form.email} onChange={(v) => setField("email", v)} error={errors.email} required placeholder="example@email.com" />
          <FormField label="연락처" type="tel" value={form.phone} onChange={(v) => setField("phone", v)} error={errors.phone} required placeholder="010-0000-0000" />

          {config.showBusiness && (
            <>
              <FormField label="현재 직업/사업" value={form.business_type} onChange={(v) => setField("business_type", v)} placeholder="예: 카페 운영, 프리랜서, 직장인 등" />
              <FormField label="달성하고 싶은 목표" type="textarea" value={form.goal} onChange={(v) => setField("goal", v)} error={errors.goal} required placeholder="예: AI로 마케팅 자동화를 구축하고 싶습니다" />
              <FormField
                label="AI 도구 경험 수준"
                type="select"
                value={form.experience_level}
                onChange={(v) => setField("experience_level", v)}
                options={EXPERIENCE_OPTIONS}
              />
            </>
          )}

          <FormField
            label="어떻게 알게 되셨나요?"
            type="select"
            value={form.how_found}
            onChange={(v) => setField("how_found", v)}
            options={HOW_FOUND_OPTIONS}
          />

          <FormField label="추천인 코드" value={form.referral_code} onChange={(v) => setField("referral_code", v)} placeholder="추천인 코드가 있다면 입력 (선택)" />

          {config.showCommitment && (
            <FormField
              label=""
              type="checkbox"
              value={form.agree_commitment}
              onChange={(v) => setField("agree_commitment", v)}
              error={errors.agree_commitment}
              placeholder="최소 3개월 약정에 동의합니다. (약정 기간 중 해지 시 위약금 없이 정지 처리됩니다)"
            />
          )}

          <FormField
            label=""
            type="checkbox"
            value={form.agree_terms}
            onChange={(v) => setField("agree_terms", v)}
            error={errors.agree_terms}
            placeholder="개인정보 수집 및 이용에 동의합니다. (신청 처리 목적으로만 사용됩니다)"
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
              marginTop: "8px",
            }}
          >
            {loading ? "처리 중..." : "신청하기"}
          </button>
        </form>
      )}
    </Modal>
  );
}
