import { useState } from "react";
import Modal from "./Modal";
import FormField from "./FormField";
import { supabase } from "../lib/supabase";

const TIER_CONFIG = {
  online: {
    title: "💻 온라인 멤버십 신청",
    grade: "달팽이 친구",
    desc: "주간 라이브 + 커뮤니티 + 템플릿으로 AI 자동화를 익힙니다",
    price: 30000,
    priceLabel: "월 정기결제",
    firstMonthDiscount: false,
    successMsg: "신청이 접수되��습니다!",
  },
  pro: {
    title: "🎤 온라인 원데이 세미나 신청",
    grade: "달팽이 주민",
    desc: "하루 6시간, 원하는 주제를 골라 온라인으로 끝냅니다. 과목을 선택하세요.",
    price: null,
    pricePerCourse: 300000,
    priceLabel: "과목당 · 6시간 · 이론+실습",
    courses: [
      { id: "landing", name: "팔리는 랜딩페이지 구축", icon: "🖥️", tag: "바이브 코딩 · 6시간", desc: "AI와 함께 전환율 높은 랜딩페이지를 직접 만들고 배포" },
      { id: "marketing", name: "나 대신 일하는 모객 시스템", icon: "🤖", tag: "AI 시스템 · 광고 · 6시간", desc: "24시간 자동으로 고객을 모으고 전환시키는 시스템 구축" },
      { id: "operation", name: "운영관리 AI 효율화", icon: "📊", tag: "관리자 페이지 · 데이터 · 6시간", desc: "데이터 기반으로 운영을 자동화하는 시스템 구축" },
      { id: "partner", name: "마케터 100명 만드는 노하우", icon: "🤝", tag: "파트너십 시스템 · 6시간", desc: "파트너십 시스템을 직접 설계하고 구축" },
    ],
    successMsg: "신청이 접수되었습니다!",
  },
  "mini-workshop": {
    title: "🔨 미니 바이브코딩 워크샵 신청",
    grade: "달팽이 탐험가",
    desc: "3시간 만에 내 손으로 랜딩페이지 1개를 만들어 가져갑니다 (정원 10명)",
    price: 100000,
    priceLabel: "회당 · 3시간 · 온라인 줌",
    successMsg: "신청이 접수되었습니다! 다음 회차 일정을 안내드리겠습니다.",
  },
  partner: {
    title: "🎓 퍼널구축 아카데미 신청",
    grade: "달팽이 가족",
    desc: "4주 만에 평생 팔리는 시스템을 만들어갑니다",
    price: 990000,
    priceLabel: "1인 · 30명 한정 · 대기자 접수 중",
    successMsg: "대기자 등록이 완료되었습니다! 개강 확정 시 안내드리겠습니다.",
  },
  bootcamp: {
    title: "🎓 집중 스터디반 신청",
    grade: null,
    desc: "4주 만에 평생 팔리는 시스템을 만들어갑니다",
    price: 990000,
    priceLabel: "1인 · 30명 한정 · 대기자 접수 중",
    successMsg: "대기자 등록이 완료되었습니다! 개강 확정 시 안내드리겠습니다.",
  },
  dfy: {
    title: "🔧 구축 대행 무료 상담",
    grade: null,
    desc: "자동화 시스템을 통째로 맡기고 싶은 분을 위한 무료 상담 신청",
    price: null,
    priceLabel: "30분 무료 상담 후 견적 안내",
    packages: [
      { id: "starter", name: "🌱 스타터", price: "300만원", desc: "랜딩페이지 + 퍼널 설계 · 납기 2주" },
      { id: "business", name: "🚀 비즈니스", price: "600만원", desc: "DB + SMS/이메일 자동화 · 납기 3주", popular: true },
      { id: "premium", name: "💎 프리미엄", price: "900만원", desc: "풀 시스템 + AI 챗봇 + 리포트 · 납기 4주" },
      { id: "custom", name: "💬 맞춤 상담", price: "금액 협의", desc: "특수 요구사항이 있으신 경우" },
    ],
    addons: [
      { id: "kakao_biz", name: "카카오 비즈채널 세팅", price: "+100만원" },
      { id: "naver_ad", name: "네이버 검색광고 세팅", price: "+80만원" },
      { id: "sns_auto", name: "SNS 콘텐츠 자동 생성", price: "+120만원" },
      { id: "competitor", name: "경쟁사 모니터링 봇", price: "+100만원" },
    ],
    maintenance: [
      { id: "basic", name: "기본 유지보수", price: "30만원/월", desc: "무제한 수정 + 장애 대응 + 모니터링" },
      { id: "growth", name: "성장 관리", price: "50만원/월", desc: "기본 + 월 1회 데이터 분석 미팅" },
      { id: "dedicated", name: "전담 운영", price: "100만원/월", desc: "성장 + SNS + 광고 + 분기 점검" },
    ],
    successMsg: "상담 요청이 접수되었습니다!",
  },
};

const formatPrice = (n) => n.toLocaleString("ko-KR");

export default function MembershipApplyModal({ isOpen, onClose, onSwitchTier, tierId }) {
  const config = TIER_CONFIG[tierId] || TIER_CONFIG.online;

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", occupation: "", motivation: "" });
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedMaintenance, setSelectedMaintenance] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [copied, setCopied] = useState(false);

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const toggleAddon = (id) => setSelectedAddons(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );
  const toggleCourse = (id) => setSelectedCourses(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );
  const isPro = tierId === "pro";

  const isDfy = tierId === "dfy";
  const totalPrice = isDfy
    ? 0
    : isPro
      ? (selectedCourses.length * (config.pricePerCourse || 0))
      : config.price;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "이름을 입력해주세요";
    if (!form.email.trim()) errs.email = "이메일을 입력해주세요";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "올바른 이메일 형식이 아닙니다";
    if (!form.phone.trim()) errs.phone = "연락처를 입력해주세요";
    if (!isDfy && !form.occupation.trim()) errs.occupation = "하시는 일을 입력해주세요";
    if (!isDfy && !form.motivation.trim()) errs.motivation = "신청 동기를 입력해주세요";
    if (isDfy && !selectedPackage) errs.packages = "관심 패키지를 선택해주세요";
    if (isPro && selectedCourses.length === 0) errs.courses = "수강할 과목을 선택해주세요";
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
          const addonNames = selectedAddons.map(id => config.addons?.find(a => a.id === id)?.name).filter(Boolean);
          const maintName = config.maintenance?.find(m => m.id === selectedMaintenance)?.name || "";
          const details = [
            `패키지: ${selectedPackage}`,
            addonNames.length > 0 ? `추가옵션: ${addonNames.join(", ")}` : "",
            maintName ? `유지보수: ${maintName}` : "",
            form.message.trim() ? `요청사항: ${form.message.trim()}` : "",
          ].filter(Boolean).join(" | ");
          const { error } = await supabase.from("contact_inquiries").insert({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            subject: `구축 대행 상담 - ${selectedPackage}`,
            message: details,
            inquiry_type: "dfy",
          });
          if (error) throw error;
        } else {
          const courseNames = isPro && selectedCourses.length > 0
            ? selectedCourses.map(id => config.courses?.find(c => c.id === id)?.name).filter(Boolean).join(", ")
            : null;
          const baseNote = tierId === "bootcamp" || tierId === "partner"
            ? "퍼널구축 아카데미 대기자 신청"
            : isPro
              ? `원데이 세미나 신청 | 선택 과목: ${courseNames} | ${selectedCourses.length}과목 × ₩300,000 = ₩${formatPrice(totalPrice)}`
              : null;
          const extraInfo = form.occupation.trim() || form.motivation.trim()
            ? ` | 하시는 일: ${form.occupation.trim()} | 신청 동기: ${form.motivation.trim()}`
            : "";
          const insertData = {
            tier_id: tierId === "bootcamp" ? "offline" : tierId === "pro" ? "offline" : tierId,
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            total_price: totalPrice,
            admin_notes: (baseNote || "") + extraInfo || null,
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
    setForm({ name: "", email: "", phone: "", message: "", occupation: "", motivation: "" });
    setSelectedPackage("");
    setSelectedAddons([]);
    setSelectedMaintenance("");
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

          {/* 프로 멤버십 — 과목 선택 */}
          {isPro && config.courses && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#3A4A3E", marginBottom: "4px" }}>
                수강 과목 선택 <span style={{ color: "#D32F2F" }}>*</span>
              </div>
              <div style={{ fontSize: "11px", color: "#8A9A8E", marginBottom: "10px" }}>
                과목당 ₩{formatPrice(config.pricePerCourse)} · 6시간 · 이론+실습 · 당일 결과물 완성
              </div>
              {config.courses.map((course) => {
                const checked = selectedCourses.includes(course.id);
                return (
                  <label
                    key={course.id}
                    onClick={() => toggleCourse(course.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "14px 16px", marginBottom: "8px",
                      borderRadius: "12px", cursor: "pointer",
                      border: checked ? "2px solid #2D6A4F" : "1.5px solid #E8E5DC",
                      background: checked ? "#F0FAF4" : "#FAFAF7",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      style={{ accentColor: "#2D6A4F", width: "18px", height: "18px", flexShrink: 0 }}
                    />
                    <span style={{ fontSize: "20px" }}>{course.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: checked ? 700 : 600, color: checked ? "#1B4332" : "#3A4A3E" }}>
                        {course.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#8A9A8E", marginTop: "2px" }}>{course.desc}</div>
                    </div>
                  </label>
                );
              })}
              {errors.courses && (
                <div style={{ fontSize: "12px", color: "#D32F2F", marginTop: "4px" }}>{errors.courses}</div>
              )}

              {/* 자동 계산 가격 */}
              <div style={{
                background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
                borderRadius: "12px", padding: "16px 20px", marginTop: "12px", textAlign: "center",
              }}>
                <div style={{ fontSize: "12px", color: "#95D5B2", marginBottom: "6px" }}>
                  {selectedCourses.length > 0
                    ? `${selectedCourses.length}과목 × ₩${formatPrice(config.pricePerCourse)}`
                    : "과목을 선택해주세요"}
                </div>
                <div style={{ fontSize: "32px", fontWeight: 800, color: selectedCourses.length > 0 ? "#fff" : "#6B9E82" }}>
                  {selectedCourses.length > 0
                    ? `₩${formatPrice(selectedCourses.length * config.pricePerCourse)}`
                    : "₩0"}
                </div>
              </div>

              {/* 4과목 선택 시 아카데미 유도 배너 */}
              {selectedCourses.length >= 4 && (
                <div style={{
                  marginTop: "12px", padding: "16px 20px", borderRadius: "12px",
                  background: "linear-gradient(135deg, #FF6B35, #E85D26)",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
                    잠깐! 이 가격이면 아카데미가 더 이득이에요
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.9)", lineHeight: 1.6, marginBottom: "10px" }}>
                    원데이 4과목 = <span style={{ textDecoration: "line-through" }}>₩{formatPrice(4 * config.pricePerCourse)}</span><br />
                    퍼널구축 아카데미 = <strong>₩990,000</strong> + 커뮤니티 + 온라인 멤버십 3개월 무료
                  </div>
                  <button
                    type="button"
                    onClick={() => onSwitchTier && onSwitchTier("partner")}
                    style={{
                      padding: "10px 24px", borderRadius: "10px",
                      background: "#fff", color: "#E85D26",
                      fontSize: "13px", fontWeight: 800,
                      border: "none", cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    🎓 퍼널구축 아카데미로 신청하기 →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 가격 표시 (DFY, 프로 제외) */}
          {config.price && !isPro && (
            <div style={{
              background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
              borderRadius: "12px", padding: "20px", marginBottom: "20px", textAlign: "center",
            }}>
              <div style={{ fontSize: "12px", color: "#95D5B2", marginBottom: "6px", letterSpacing: "0.1em" }}>
                {config.priceLabel}
              </div>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#fff" }}>
                ₩{formatPrice(config.price)}
                {tierId !== "bootcamp" && tierId !== "partner" && <span style={{ fontSize: "15px", fontWeight: 500, color: "#B7E4C7" }}>/월</span>}
              </div>
              {config.firstMonthDiscount && (
                <div style={{ fontSize: "12px", color: "#95D5B2", marginTop: "8px" }}>
                  레터 구���자 첫 달 50% → ₩{formatPrice(Math.round(config.price / 2))}
                </div>
              )}
              {(tierId === "bootcamp" || tierId === "partner") && (
                <div style={{ fontSize: "12px", color: "#95D5B2", marginTop: "8px" }}>
                  주 1회 5시간 (스터디 3h + 실습 2h) · 4주 과정 �� 총 20시간
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
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "14px 16px", marginBottom: "8px",
                      borderRadius: "12px", cursor: "pointer",
                      border: checked ? "2px solid #2D6A4F" : "1.5px solid #E8E5DC",
                      background: checked ? "#F0FAF4" : "#FAFAF7",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="radio"
                      checked={checked}
                      onChange={() => {}}
                      style={{ accentColor: "#2D6A4F", width: "18px", height: "18px", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: checked ? 700 : 600, color: checked ? "#1B4332" : "#3A4A3E" }}>
                          {pkg.name}
                        </span>
                        {pkg.popular && (
                          <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", background: "#52B788", padding: "2px 8px", borderRadius: "100px" }}>인기</span>
                        )}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6B7B6E", marginTop: "2px" }}>{pkg.desc}</div>
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: checked ? "#1B4332" : "#8A9A8E", flexShrink: 0 }}>
                      {pkg.price}
                    </span>
                  </label>
                );
              })}
              {errors.packages && (
                <div style={{ fontSize: "12px", color: "#D32F2F", marginTop: "4px" }}>{errors.packages}</div>
              )}
            </div>
          )}

          {/* DFY 추가 옵션 */}
          {isDfy && config.addons && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#3A4A3E", marginBottom: "4px" }}>
                추가 옵션 <span style={{ fontSize: "11px", color: "#8A9A8E", fontWeight: 400 }}>(선택)</span>
              </div>
              <div style={{ fontSize: "11px", color: "#8A9A8E", marginBottom: "10px" }}>원하는 옵션을 자유롭게 선택하세요</div>
              {config.addons.map((addon) => {
                const checked = selectedAddons.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "12px 14px", marginBottom: "6px",
                      borderRadius: "10px", cursor: "pointer",
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
                    <span style={{ flex: 1, fontSize: "13px", fontWeight: checked ? 600 : 500, color: checked ? "#1B4332" : "#5A6A5E" }}>
                      {addon.name}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: checked ? "#2D6A4F" : "#8A9A8E", flexShrink: 0 }}>
                      {addon.price}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {/* DFY 유지보수 플랜 */}
          {isDfy && config.maintenance && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#3A4A3E", marginBottom: "4px" }}>
                납품 후 유지보수 <span style={{ fontSize: "11px", color: "#8A9A8E", fontWeight: 400 }}>(선택)</span>
              </div>
              <div style={{ fontSize: "11px", color: "#8A9A8E", marginBottom: "10px" }}>구축 완료 후 지속 관리가 필요하시면 선택하세요</div>
              {config.maintenance.map((plan) => {
                const checked = selectedMaintenance === plan.id;
                return (
                  <label
                    key={plan.id}
                    onClick={() => setSelectedMaintenance(checked ? "" : plan.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "12px 14px", marginBottom: "6px",
                      borderRadius: "10px", cursor: "pointer",
                      border: checked ? "2px solid #52B788" : "1.5px solid #E8E5DC",
                      background: checked ? "#F0FAF4" : "#FAFAF7",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="radio"
                      checked={checked}
                      onChange={() => {}}
                      style={{ accentColor: "#2D6A4F", width: "16px", height: "16px", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "13px", fontWeight: checked ? 600 : 500, color: checked ? "#1B4332" : "#5A6A5E" }}>
                        {plan.name}
                      </span>
                      <div style={{ fontSize: "11px", color: "#8A9A8E", marginTop: "2px" }}>{plan.desc}</div>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: checked ? "#2D6A4F" : "#8A9A8E", flexShrink: 0 }}>
                      {plan.price}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          <FormField label="이름" value={form.name} onChange={(v) => setField("name", v)} error={errors.name} required placeholder="홍길동" />
          <FormField label="연락처" type="tel" value={form.phone} onChange={(v) => setField("phone", v)} error={errors.phone} required placeholder="010-8531-9531" />
          <FormField label="이메일" type="email" value={form.email} onChange={(v) => setField("email", v)} error={errors.email} required placeholder="example@email.com" />

          {!isDfy && (
            <>
              <FormField label="하시는 일" value={form.occupation} onChange={(v) => setField("occupation", v)} error={errors.occupation} required placeholder="예: 펜션 운영, 카페 사장, 공방 운영 등" />
              <FormField label="신청 동기" type="textarea" value={form.motivation} onChange={(v) => setField("motivation", v)} error={errors.motivation} required placeholder="어떤 문제를 해결하고 싶으신가요? 기대하는 점을 적어주세요" />
            </>
          )}

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
            disabled={loading || (isDfy && !selectedPackage) || (isPro && selectedCourses.length === 0)}
            style={{
              width: "100%", padding: "14px", borderRadius: "12px",
              background: (loading || (isDfy && !selectedPackage) || (isPro && selectedCourses.length === 0))
                ? "#95D5B2"
                : "linear-gradient(135deg, #1B4332, #2D6A4F)",
              color: "#fff", fontSize: "15px", fontWeight: 700,
              border: "none",
              cursor: (loading || (isDfy && !selectedPackage) || (isPro && selectedCourses.length === 0)) ? "not-allowed" : "pointer",
              marginTop: "8px",
            }}
          >
            {loading
              ? "처리 중..."
              : isDfy
                ? "무료 상담 신청하기"
                : isPro
                  ? selectedCourses.length > 0
                    ? `₩${formatPrice(totalPrice)} 원데이 세미나 신청 (${selectedCourses.length}과목)`
                    : "과목을 선택해주세요"
                  : tierId === "bootcamp" || tierId === "partner"
                    ? `₩${formatPrice(config.price)} 퍼널구축 아카데미 대기자 신청`
                    : `₩${formatPrice(config.price)}/월 정기결제 신청`
            }
          </button>
        </form>
      )}
    </Modal>
  );
}
