import { useState } from "react";
import Modal from "./Modal";
import FormField from "./FormField";
import { supabase } from "../lib/supabase";

const TIER_CONFIG = {
  online: {
    title: "💻 온라인 멤버십 신청",
    grade: "달팽이 친구",
    desc: "주간 라이브 + 커뮤니티 + 템플릿으로 AI 자동화를 익힙니다",
    price: 29900,
    priceLabel: "월 정기결제",
    firstMonthDiscount: true,
    successMsg: "신청이 접수되��습니다!",
  },
  pro: {
    title: "🔧 프로 멤버십 신청",
    grade: "달팽이 주민",
    desc: "소그룹 코칭 + 오프라인 실습으로 직접 만들고 결과를 냅니다",
    price: 199000,
    priceLabel: "월 정기결제",
    successMsg: "신청이 접수되었습니다!",
  },
  partner: {
    title: "🚀 파트너 멤버십 문의",
    grade: "달팽이 가족",
    desc: "1:1 코칭으로 자동화 수익 시스템을 완전히 구축합니다",
    price: 990000,
    priceLabel: "월 정기결제 · 20명 한정",
    successMsg: "문의가 접수되었습니다!",
  },
  bootcamp: {
    title: "🎓 8주 부트캠프 신청",
    grade: null,
    desc: "8주 동안 내 사업에 맞는 자동화 시스템을 처음부터 끝까지 만듭니다",
    price: 990000,
    priceLabel: "1인 · 30명 한정 · 연 4기",
    successMsg: "신청이 접수되었습니다!",
  },
  dfy: {
    title: "🔧 구축 대행 무료 상담",
    grade: null,
    desc: "자동화 시스템을 통째로 맡기고 싶은 분을 위한 무료 상담 신청",
    price: null,
    priceLabel: "30분 무료 상담 후 견적 안내",
    packages: [
      { id: "starter", name: "⚡ 스타터 (300만원)", price: 3000000 },
      { id: "business", name: "🏢 비즈니스 (500만원)", price: 5000000 },
      { id: "premium", name: "👑 프리미엄 (800만원)", price: 8000000 },
      { id: "custom", name: "💬 맞춤 상담 (금액 협의)", price: 0 },
    ],
    successMsg: "상담 요청이 접수되었습니다!",
  },
};

const formatPrice = (n) => n.toLocaleString("ko-KR");

export default function MembershipApplyModal({ isOpen, onClose, tierId }) {
  const config = TIER_CONFIG[tierId] || TIER_CONFIG.online;

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [selectedPackage, setSelectedPackage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [copied, setCopied] = useState(false);

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const isDfy = tierId === "dfy";
  const totalPrice = isDfy
    ? (config.packages?.find(p => p.id === selectedPackage)?.price || 0)
    : config.price;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "이름을 입력해주세요";
    if (!form.email.trim()) errs.email = "이메일을 입력해주세요";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "올바른 이메일 형식이 아닙니다";
    if (!form.phone.trim()) errs.phone = "연락처를 입력해주세요";
    if (isDfy && !selectedPackage) errs.packages = "관심 패키지를 선택해주세요";
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
        if (isDfy) {
          const { error } = await supabase.from("contact_inquiries").insert({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            subject: `구축 대행 상담 - ${selectedPackage}`,
            message: form.message.trim() || `패키지: ${selectedPackage}`,
            inquiry_type: "dfy",
          });
          if (error) throw error;
        } else {
          const insertData = {
            tier_id: tierId === "bootcamp" ? "offline" : tierId === "pro" ? "offline" : tierId,
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            total_price: totalPrice,
            admin_notes: tierId === "bootcamp" ? "8주 부트캠프 신청" : tierId === "pro" ? "프로 멤버십 신청" : null,
          };
          const { error } = await supabase.from("membership_applications").insert(insertData);
          if (error) throw error;
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
    setForm({ name: "", email: "", phone: "", message: "" });
    setSelectedPackage("");
    setErrors({});
    setSuccess(false);
    setSubmitError("");
    setCopied(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={config.title}>
      {success ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          {isDfy ? (
            /* DFY 상담 접수 완료 */
            <>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔧</div>
              <h4 style={{
                fontFamily: "'Noto Serif KR', serif", fontSize: "20px",
                fontWeight: 700, color: "#1B4332", marginBottom: "16px",
              }}>상담 요청 접수 완료!</h4>
              <p style={{
                fontSize: "14px", color: "#5A6A5E", lineHeight: 1.8,
                marginBottom: "24px",
              }}>
                빠른 시일 내에 연락드리겠습니다.<br />
                30분 무료 상담을 통해 맞춤 견적을 안내해 드립니다.
              </p>
              <button onClick={handleClose} style={{
                width: "100%", padding: "14px", borderRadius: "12px",
                background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
                color: "#fff", fontSize: "15px", fontWeight: 700,
                border: "none", cursor: "pointer",
              }}>확인</button>
            </>
          ) : (
            /* 멤버십/부트캠프 입금 요청 */
            <>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>💸</div>
              <h4 style={{
                fontFamily: "'Noto Serif KR', serif", fontSize: "20px",
                fontWeight: 700, color: "#1B4332", marginBottom: "16px",
              }}>입금 요청</h4>

              <div style={{
                background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
                borderRadius: "12px", padding: "24px", marginBottom: "16px", textAlign: "center",
              }}>
                <div style={{ fontSize: "12px", color: "#95D5B2", marginBottom: "10px", letterSpacing: "0.1em" }}>입금 계좌</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>
                  카카오뱅크 3333-06-4749542
                </div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#B7E4C7", marginBottom: "12px" }}>예금주: 임솔</div>

                <div style={{ fontSize: "12px", color: "#95D5B2", marginBottom: "6px" }}>{config.priceLabel}</div>
                {config.firstMonthDiscount ? (
                  <>
                    <div style={{
                      fontSize: "26px", fontWeight: 800, color: "#FEE500",
                      background: "rgba(254,229,0,0.1)", padding: "8px 16px",
                      borderRadius: "8px", display: "inline-block",
                    }}>
                      ₩{formatPrice(config.price)}<span style={{ fontSize: "13px", color: "#B7E4C7" }}>/월</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#95D5B2", marginTop: "6px" }}>
                      첫 달 50% 할인 ₩{formatPrice(Math.round(config.price / 2))} (레터 구독자)
                    </div>
                  </>
                ) : (
                  <div style={{
                    fontSize: "26px", fontWeight: 800, color: "#FEE500",
                    background: "rgba(254,229,0,0.1)", padding: "8px 16px",
                    borderRadius: "8px", display: "inline-block",
                  }}>
                    ₩{formatPrice(config.price)}
                    {tierId !== "bootcamp" && <span style={{ fontSize: "13px", color: "#B7E4C7" }}>/월</span>}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText("3333-06-4749542");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{
                  width: "100%", padding: "14px", borderRadius: "12px",
                  background: copied ? "#2D6A4F" : "linear-gradient(135deg, #1B4332, #2D6A4F)",
                  color: "#fff", fontSize: "15px", fontWeight: 700,
                  border: "none", cursor: "pointer", marginBottom: "10px",
                  transition: "all 0.2s",
                }}
              >
                {copied ? "✅ 계좌번호 복사 완료!" : "📋 계좌번호 복사하기"}
              </button>

              <p style={{
                fontSize: "13px", color: "#5A6A5E", lineHeight: 1.8,
                marginBottom: "16px", textAlign: "center",
              }}>
                입금 확인 후 신청 완료 문자를 보내드립니다!
              </p>

              <button onClick={handleClose} style={{
                width: "100%", padding: "14px", borderRadius: "12px",
                background: "#F5F4EF", color: "#3A4A3E",
                fontSize: "15px", fontWeight: 600,
                border: "1px solid #E8E5DC", cursor: "pointer",
              }}>확인</button>
            </>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p style={{ fontSize: "14px", color: "#6B7B6E", marginBottom: "8px", lineHeight: 1.6 }}>
            {config.desc}
          </p>
          {config.grade && (
            <p style={{
              fontSize: "12px", color: "#5A6A5E", marginBottom: "16px",
              background: "#F0FAF4", padding: "8px 12px", borderRadius: "8px", lineHeight: 1.5,
            }}>
              신청 시 등급은 <strong style={{ color: "#1B4332" }}>Lv. {config.grade}</strong>로 표시됩니다.
            </p>
          )}

          {/* 가격 표시 (DFY 제외) */}
          {config.price && (
            <div style={{
              background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
              borderRadius: "12px", padding: "20px", marginBottom: "20px", textAlign: "center",
            }}>
              <div style={{ fontSize: "12px", color: "#95D5B2", marginBottom: "6px", letterSpacing: "0.1em" }}>
                {config.priceLabel}
              </div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#fff" }}>
                ₩{formatPrice(config.price)}
                {tierId !== "bootcamp" && <span style={{ fontSize: "15px", fontWeight: 500, color: "#B7E4C7" }}>/월</span>}
              </div>
              {config.firstMonthDiscount && (
                <div style={{ fontSize: "12px", color: "#95D5B2", marginTop: "8px" }}>
                  레터 구독자 첫 달 50% → ₩{formatPrice(Math.round(config.price / 2))}
                </div>
              )}
              {tierId === "bootcamp" && (
                <div style={{ fontSize: "12px", color: "#95D5B2", marginTop: "8px" }}>
                  온라인 주 2회 · 8주 과정 · 30명 한정
                </div>
              )}
            </div>
          )}

          {/* DFY 패키지 선택 */}
          {isDfy && config.packages && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#3A4A3E", marginBottom: "10px" }}>
                관심 패키지 <span style={{ color: "#D32F2F" }}>*</span>
              </div>
              {config.packages.map((pkg) => {
                const checked = selectedPackage === pkg.id;
                return (
                  <label
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "12px 14px", marginBottom: "8px",
                      borderRadius: "10px", cursor: "pointer",
                      border: checked ? "2px solid #2D6A4F" : "1.5px solid #E8E5DC",
                      background: checked ? "#F0FAF4" : "#FAFAF7",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="radio"
                      checked={checked}
                      onChange={() => {}}
                      style={{ accentColor: "#2D6A4F", width: "18px", height: "18px" }}
                    />
                    <span style={{ fontSize: "14px", fontWeight: checked ? 700 : 500, color: checked ? "#1B4332" : "#5A6A5E" }}>
                      {pkg.name}
                    </span>
                  </label>
                );
              })}
              {errors.packages && (
                <div style={{ fontSize: "12px", color: "#D32F2F", marginTop: "4px" }}>{errors.packages}</div>
              )}
            </div>
          )}

          <FormField label="이름" value={form.name} onChange={(v) => setField("name", v)} error={errors.name} required placeholder="홍길동" />
          <FormField label="이메일" type="email" value={form.email} onChange={(v) => setField("email", v)} error={errors.email} required placeholder="example@email.com" />
          <FormField label="연락처" type="tel" value={form.phone} onChange={(v) => setField("phone", v)} error={errors.phone} required placeholder="010-8531-9531" />

          {isDfy && (
            <FormField
              label="추가 요청사항"
              type="textarea"
              value={form.message}
              onChange={(v) => setField("message", v)}
              placeholder="자동화하고 싶은 업무나 현재 상황을 간단히 적어주세요 (선택)"
            />
          )}

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
            disabled={loading || (isDfy && !selectedPackage)}
            style={{
              width: "100%", padding: "14px", borderRadius: "12px",
              background: (loading || (isDfy && !selectedPackage))
                ? "#95D5B2"
                : "linear-gradient(135deg, #1B4332, #2D6A4F)",
              color: "#fff", fontSize: "15px", fontWeight: 700,
              border: "none",
              cursor: (loading || (isDfy && !selectedPackage)) ? "not-allowed" : "pointer",
              marginTop: "8px",
            }}
          >
            {loading
              ? "처리 중..."
              : isDfy
                ? "무료 상담 신청하기"
                : tierId === "bootcamp"
                  ? `₩${formatPrice(config.price)} 부트캠프 신청하기`
                  : `₩${formatPrice(config.price)}/월 정기결제 신청`
            }
          </button>
        </form>
      )}
    </Modal>
  );
}
