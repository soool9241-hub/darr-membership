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
    yearlyPrice: 9900 * 12,
    priceLabel: "1년 멤버십",
    successMsg: "신청이 접수되었습니다!",
  },
  offline: {
    title: "🔧 오프라인 멤버십 신청",
    grade: "달팽이 주민",
    desc: "AI 수익화 · 자동화 시스템을 만들어 봅니다",
    pricePerClass: 99000,
    priceLabel: "선택 수강 · 월 1회 수업",
    courses: [
      { id: "landing", name: "팔리는 랜딩페이지 구축", emoji: "🌐" },
      { id: "mokaek", name: "나 대신 일하는 모객 시스템", emoji: "🤖" },
      { id: "operations", name: "운영관리 AI 효율화", emoji: "⚙️" },
      { id: "partnership", name: "마케터 100명 만드는 파트너십", emoji: "🤝" },
    ],
    successMsg: "신청이 접수되었습니다!",
  },
  partner: {
    title: "🚀 파트너 멤버십 문의",
    grade: "달팽이 가족",
    desc: "AI 수익화 · 자동화 시스템을 만들고 활용하여 지속 가능한 자동화 수익을 만들어봅니다!",
    price: 990000,
    priceLabel: "월 정기결제",
    successMsg: "문의가 접수되었습니다!",
  },
};

const formatPrice = (n) => n.toLocaleString("ko-KR");

export default function MembershipApplyModal({ isOpen, onClose, tierId }) {
  const config = TIER_CONFIG[tierId] || TIER_CONFIG.online;

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [copied, setCopied] = useState(false);

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleCourse = (id) => {
    setSelectedCourses(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const isOffline = tierId === "offline";
  const totalPrice = isOffline
    ? selectedCourses.length * config.pricePerClass
    : config.yearlyPrice || config.price;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "이름을 입력해주세요";
    if (!form.email.trim()) errs.email = "이메일을 입력해주세요";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "올바른 이메일 형식이 아닙니다";
    if (!form.phone.trim()) errs.phone = "연락처를 입력해주세요";
    if (isOffline && selectedCourses.length === 0) errs.courses = "수강할 수업을 선택해주세요";
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
        const insertData = {
          tier_id: tierId,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          total_price: totalPrice,
        };
        if (isOffline) {
          insertData.months = selectedCourses.length;
          insertData.admin_notes = selectedCourses.join(", ");
        }
        const { error } = await supabase.from("membership_applications").insert(insertData);
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
    setSelectedCourses([]);
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
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>💸</div>
          <h4 style={{
            fontFamily: "'Noto Serif KR', serif", fontSize: "20px",
            fontWeight: 700, color: "#1B4332", marginBottom: "16px",
          }}>
            입금 요청
          </h4>

          <div style={{
            background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
            borderRadius: "12px", padding: "24px", marginBottom: "16px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "12px", color: "#95D5B2", marginBottom: "10px", letterSpacing: "0.1em" }}>입금 계좌</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>
              카카오뱅크 3333-06-4749542
            </div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "#B7E4C7", marginBottom: "12px" }}>예금주: 임솔</div>

            {isOffline ? (
              <>
                <div style={{ fontSize: "12px", color: "#95D5B2", marginBottom: "6px" }}>
                  선택 수업 {selectedCourses.length}건
                </div>
                <div style={{
                  fontSize: "22px", fontWeight: 800, color: "#FEE500",
                  background: "rgba(254,229,0,0.1)", padding: "8px 16px",
                  borderRadius: "8px", display: "inline-block",
                }}>
                  ₩{formatPrice(totalPrice)}
                </div>
              </>
            ) : config.yearlyPrice ? (
              <>
                <div style={{ fontSize: "12px", color: "#95D5B2", marginBottom: "6px" }}>1년 멤버십 · 정기결제 할인가</div>
                <div style={{
                  fontSize: "26px", fontWeight: 800, color: "#FEE500",
                  background: "rgba(254,229,0,0.1)", padding: "8px 16px",
                  borderRadius: "8px", display: "inline-block",
                }}>
                  ₩{formatPrice(config.price)}<span style={{ fontSize: "13px", color: "#B7E4C7" }}>/월</span>
                </div>
                <div style={{ fontSize: "11px", color: "#95D5B2", marginTop: "6px" }}>
                  1년 멤버십 ₩{formatPrice(config.yearlyPrice)}
                </div>
              </>
            ) : (
              <div style={{
                fontSize: "22px", fontWeight: 800, color: "#FEE500",
                background: "rgba(254,229,0,0.1)", padding: "8px 16px",
                borderRadius: "8px", display: "inline-block",
              }}>
                ₩{formatPrice(config.price)}<span style={{ fontSize: "13px", color: "#B7E4C7" }}>/월</span>
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
          }}>
            확인
          </button>
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

          {/* 온라인: 월 금액 강조 + 연 금액 작게 */}
          {config.yearlyPrice && (
            <div style={{
              background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
              borderRadius: "12px", padding: "20px", marginBottom: "20px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "12px", color: "#95D5B2", marginBottom: "6px", letterSpacing: "0.1em" }}>1년 멤버십 · 정기결제 할인가</div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#fff" }}>
                ₩{formatPrice(config.price)}<span style={{ fontSize: "15px", fontWeight: 500, color: "#B7E4C7" }}>/월</span>
              </div>
              <div style={{ fontSize: "12px", color: "#95D5B2", marginTop: "8px" }}>
                1년 멤버십 ₩{formatPrice(config.yearlyPrice)}
              </div>
            </div>
          )}

          {/* 오프라인: 수업 선택 체크박스 */}
          {isOffline && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#3A4A3E", marginBottom: "10px" }}>
                수강할 수업 선택 <span style={{ color: "#D32F2F" }}>*</span>
                <span style={{ fontSize: "11px", fontWeight: 400, color: "#8A9A8E", marginLeft: "8px" }}>
                  ₩{formatPrice(config.pricePerClass)} / 건
                </span>
              </div>
              {config.courses.map((course) => {
                const checked = selectedCourses.includes(course.id);
                return (
                  <label
                    key={course.id}
                    onClick={() => toggleCourse(course.id)}
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
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      style={{ accentColor: "#2D6A4F", width: "18px", height: "18px" }}
                    />
                    <span style={{ fontSize: "18px" }}>{course.emoji}</span>
                    <span style={{ fontSize: "14px", fontWeight: checked ? 700 : 500, color: checked ? "#1B4332" : "#5A6A5E" }}>
                      {course.name}
                    </span>
                  </label>
                );
              })}
              {errors.courses && (
                <div style={{ fontSize: "12px", color: "#D32F2F", marginTop: "4px" }}>{errors.courses}</div>
              )}

              <div style={{
                background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
                borderRadius: "12px", padding: "16px", marginTop: "12px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "12px", color: "#95D5B2", marginBottom: "4px" }}>
                  {selectedCourses.length}건 선택
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>
                  ₩{formatPrice(totalPrice)}
                </div>
                <div style={{ fontSize: "11px", color: "#95D5B2", marginTop: "6px" }}>
                  현재 커리큘럼 4개 · 추후 업데이트 예정
                </div>
              </div>
            </div>
          )}

          {/* 파트너: 월 정기결제 */}
          {!config.yearlyPrice && !isOffline && (
            <div style={{
              background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
              borderRadius: "12px", padding: "20px", marginBottom: "20px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "12px", color: "#95D5B2", marginBottom: "6px", letterSpacing: "0.1em" }}>{config.priceLabel}</div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#fff" }}>
                ₩{formatPrice(config.price)}<span style={{ fontSize: "15px", fontWeight: 500, color: "#B7E4C7" }}>/월</span>
              </div>
              <div style={{ fontSize: "11px", color: "#95D5B2", marginTop: "8px" }}>
                매월 자동결제 · 언제든 해지 가능
              </div>
            </div>
          )}

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
            disabled={loading || (isOffline && selectedCourses.length === 0)}
            style={{
              width: "100%", padding: "14px", borderRadius: "12px",
              background: (loading || (isOffline && selectedCourses.length === 0))
                ? "#95D5B2"
                : "linear-gradient(135deg, #1B4332, #2D6A4F)",
              color: "#fff", fontSize: "15px", fontWeight: 700,
              border: "none",
              cursor: (loading || (isOffline && selectedCourses.length === 0)) ? "not-allowed" : "pointer",
              marginTop: "8px",
            }}
          >
            {loading
              ? "처리 중..."
              : isOffline
                ? selectedCourses.length > 0
                  ? `${selectedCourses.length}건 · ₩${formatPrice(totalPrice)} 신청하기`
                  : "수업을 선택해주세요"
                : `₩${formatPrice(config.price)}/월 정기결제 신청`
            }
          </button>
        </form>
      )}
    </Modal>
  );
}
