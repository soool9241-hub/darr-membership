import { useState, useEffect, useRef, useCallback } from "react";
import NewsletterSignupModal from "./components/NewsletterSignupModal";
import MembershipApplyModal from "./components/MembershipApplyModal";

/* ─── DATA ─── */
const TIERS = [
  {
    id: "letter",
    level: "Lv.1",
    emoji: "📬",
    name: "달팽이레터",
    subtitle: "주 2회 AI 트렌드 전달",
    price: "무료",
    priceNote: "",
    badge: "Lv.1",
    badgeColor: "#4A7C59",
    schedule: "매주 2회 · 화 오후9시 ~ 목 오후9시",
    goal: "최신 AI 소식과 트렌드를 빠르게 전달",
    features: [
      '주 2회 최신 AI 자동화 트렌드 뉴스레터',
      '"이런 게 있다" — 새로운 도구·서비스·사례 큐레이션',
      "실제 펜션·공방 자동화 비하인드 스토리",
      "멤버십 전용 할인 & 우선 안내",
    ],
    bonuses: [],
    cta: "무료 구독하기",
    highlight: false,
  },
  {
    id: "online",
    level: "Lv.2",
    emoji: "💻",
    name: "온라인 멤버십",
    subtitle: "등급: 달팽이 친구 · 주 1회 AI 자동화 경험 & 인사이트 공유",
    price: "₩9,900",
    priceNote: "월 / 정기결제",
    badge: "Lv.2",
    badgeColor: "#2D6A4F",
    schedule: "월 4회 · 매주 화요일 10:00~12:00 (2시간)",
    goal: "실제 돌아가는 자동화 시스템을 눈으로 확인",
    features: [
      "매주 2시간 라이브 시연 세션",
      "실제 운영 중인 자동화 구조 공개",
      "n8n · Supabase · Claude 활용 사례 시연",
      '"이런 게 된다" — 가능성과 구조를 보여주는 시간',
      "질의응답 & 커뮤니티 접근",
    ],
    bonuses: ["첫 30일 집중 온보딩 커리큘럼"],
    cta: "온라인 멤버십 시작",
    highlight: false,
  },
  {
    id: "offline",
    level: "Lv.3",
    emoji: "🔧",
    name: "오프라인 멤버십",
    subtitle: "등급: 달팽이 주민 · 월 1회 정기 · 100% 실습 · 결과물 만들어가기",
    price: "₩99,000",
    priceNote: "월 / 정기결제 · 최소 3개월",
    badge: "Lv.3",
    badgeColor: "#1B4332",
    schedule: "월 1회 · 오프라인 원데이 모임",
    goal: "현장에서 직접 만들고, 완성된 결과물을 가져간다",
    features: [
      "팔리는 랜딩페이지 구축 — 바이브 코딩",
      "나 대신 일하는 모객 시스템 — AI 에이전트 설계",
      "운영관리 AI 효율화 — 관리자 페이지 고도화",
      "마케터 100명 만드는 법 — 파트너십 시스템",
      "이론 + 실습 병행, 당일 결과물 완성",
      "120평 CNC 공방 현장 워크숍",
      "온라인 멤버십 전체 포함",
    ],
    bonuses: ["펜션 20% 할인", "공방 시설 무료 이용"],
    cta: "오프라인 멤버십 신청",
    highlight: true,
  },
  {
    id: "partner",
    level: "Lv.4",
    emoji: "🚀",
    name: "파트너 멤버십",
    subtitle: "등급: 달팽이 가족 · 수익모델 설계 + 마케팅 퍼널 시스템 완전 구축",
    price: "₩990,000",
    priceNote: "월 / 정기결제 · 최소 3개월",
    badge: "Lv.4",
    badgeColor: "#081C15",
    schedule: "월 4회 · 주 1회 × 8시간 (월 32시간)",
    goal: "수익모델 설계부터 마케팅 시스템까지 완전 구축",
    features: [
      "주 1회 8시간 밀착 원데이 세션",
      "나만의 수익모델 구조 설계 & 검증",
      "마케팅 자동화 시스템 직접 구축",
      "랜딩페이지 + 모객 + 파트너십 올인원",
      "n8n · Supabase · 웹사이트 세팅 동행",
      "온라인 + 오프라인 멤버십 전체 포함",
    ],
    bonuses: ["펜션 무료 이용", "공방 시설 무료 이용", "수익 분배 파트너십 참여"],
    cta: "파트너 멤버십 문의",
    highlight: false,
  },
  {
    id: "custom",
    level: "Lv.5",
    emoji: "👑",
    name: "자동화 시스템 구축",
    subtitle: "자동화 인생 10년의 총 노하우로 셋팅해드립니다",
    price: "커스텀",
    priceNote: "금액 협의",
    badge: "SOLD OUT",
    badgeColor: "#D32F2F",
    schedule: "일정 협의 · 1:1 맞춤 셋팅",
    goal: "당신의 비즈니스에 맞는 자동화 시스템을 통째로 구축",
    features: [
      "비즈니스 분석 & 자동화 설계",
      "n8n · Supabase · AI 에이전트 풀 셋팅",
      "랜딩페이지 + 모객 + CRM 올인원 구축",
      "운영 매뉴얼 & 유지보수 가이드 제공",
      "구축 완료 후 1개월 무상 지원",
      "달팽이 전 등급 혜택 포함",
    ],
    bonuses: ["펜션 무료 이용", "공방 시설 무료 이용", "평생 커뮤니티 접근"],
    cta: "SOLD OUT",
    highlight: false,
    soldOut: true,
  },
];

const CURRICULUM = [
  {
    num: "01",
    icon: "🖥️",
    title: "팔리는 랜딩페이지 구축",
    tag: "바이브 코딩",
    desc: "코딩을 몰라도 AI와 함께 바이브 코딩으로 전환율 높은 랜딩페이지를 직접 만들고 배포합니다.",
    details: ["React + Vercel 배포", "전환율 높은 구조 설계", "AI 코파일럿 활용 실습"],
  },
  {
    num: "02",
    icon: "🤖",
    title: "나 대신 일하는 모객 시스템 구축",
    tag: "AI 시스템 · 광고",
    desc: "AI 시스템과 광고 채널을 연결해 24시간 자동으로 고객을 모으고 전환시키는 시스템을 구축합니다.",
    details: ["AI 에이전트 & n8n 자동화", "네이버 광고 · 유튜브 광고", "인스타그램 · 페이스북 광고"],
  },
  {
    num: "03",
    icon: "📊",
    title: "운영관리 AI 효율화",
    tag: "관리자 페이지 · 데이터",
    desc: "관리자 페이지를 고도화하고, 데이터 기반으로 운영을 자동화하는 시스템을 만듭니다.",
    details: ["관리자 페이지 고도화", "데이터 기반 의사결정", "운영 자동화 파이프라인"],
  },
  {
    num: "04",
    icon: "🤝",
    title: "나 대신 팔아줄 마케터 100명 만드는 노하우",
    tag: "파트너십 시스템",
    desc: "혼자 팔지 않아도 매출이 오르는 구조. 파트너십 시스템을 직접 만들어갑니다.",
    details: ["파트너 모집 & 관리 시스템", "수익 분배 자동화", "확장 가능한 영업 구조"],
  },
];

const PROOF_ITEMS = [
  { number: "7년", label: "호스팅 경력" },
  { number: "5.0", label: "에어비앤비 평점" },
  { number: "120평", label: "CNC 공방 운영" },
  { number: "304+", label: "누적 예약 건수" },
  { number: "10개", label: "AI 에이전트 운영 중" },
  { number: "24시간", label: "자동화 시스템 가동" },
];

const FUNNEL_STEPS = [
  { emoji: "📬", label: "Lv.1 달팽이레터", sub: '"이런 게 있다" — AI 트렌드 파악', price: "무료", color: "#95D5B2" },
  { emoji: "💻", label: "Lv.2 온라인 멤버십", sub: '"이런 게 된다" — 경험 & 인사이트 공유 (등급: 달팽이 친구)', price: "₩9,900/월", color: "#52B788" },
  { emoji: "🔧", label: "Lv.3 오프라인 멤버십", sub: '"직접 만든다" — 100% 실습 & 결과물 (등급: 달팽이 주민)', price: "₩99,000/월", color: "#2D6A4F" },
  { emoji: "🚀", label: "Lv.4 파트너 멤버십", sub: '"시스템을 구축한다" — 수익모델 완성 (등급: 달팽이 가족)', price: "₩990,000/월", color: "#1B4332" },
  { emoji: "👑", label: "Lv.5 시스템 구축", sub: '"통째로 맡긴다" — 풀 셋팅 서비스', price: "SOLD OUT", color: "#0D1F17" },
];

const RUNNING_SYSTEMS = [
  { icon: "🤖", name: "AI 예약 에이전트", desc: "24시간 자동 예약 접수 & 응대" },
  { icon: "📱", name: "SMS 마케팅 자동화", desc: "Solapi 연동 자동 발송 시스템" },
  { icon: "🔄", name: "n8n 워크플로우", desc: "10개 이상 자동화 파이프라인 운영" },
  { icon: "🗄️", name: "Supabase 데이터베이스", desc: "고객·예약·파트너 데이터 통합 관리" },
  { icon: "🌐", name: "랜딩페이지 자동 생성", desc: "React + Vercel 기반 즉시 배포" },
  { icon: "📊", name: "매출 대시보드", desc: "실시간 매출·예약 모니터링" },
];

const MEMBER_PERKS = [
  { icon: "🏡", title: "독채 펜션 할인", desc: "오프라인 멤버 20% / 파트너 멤버 무료 이용", tier: "오프라인+" },
  { icon: "🔧", title: "CNC 공방 무료 이용", desc: "120평 공방 시설 & 장비 자유 이용", tier: "오프라인+" },
  { icon: "🛠️", title: "신규 AI 도구 우선 체험", desc: "새로운 자동화 도구 출시 시 멤버 우선 공개", tier: "온라인+" },
  { icon: "💰", title: "수익 분배 파트너십", desc: "멤버 소개 시 반복 수익 분배 (최대 40%)", tier: "파트너" },
  { icon: "👥", title: "소수 정예 커뮤니티", desc: "20명 한정 비공개 그룹 — 깊은 네트워킹", tier: "오프라인+" },
  { icon: "📋", title: "수익모델 상호 리뷰", desc: "멤버 간 비즈니스 모델 피드백 & 검증", tier: "파트너" },
];

const FAQ_ITEMS = [
  {
    q: "코딩을 전혀 몰라도 참여할 수 있나요?",
    a: "네, 바이브 코딩은 AI와 대화하면서 코드를 만드는 방식입니다. 코딩 경험이 전혀 없어도 당일 결과물을 완성할 수 있도록 설계했습니다.",
  },
  {
    q: "온라인 멤버십만으로도 충분한가요?",
    a: "온라인 멤버십은 '이런 게 된다'를 눈으로 확인하는 단계입니다. 직접 결과물을 만들고 싶다면 오프라인, 수익 시스템을 완전히 구축하고 싶다면 파트너 멤버십을 추천합니다.",
  },
  {
    q: "3개월 약정이 있는 이유는?",
    a: "실제 결과를 보려면 최소 3개월이 필요합니다. 1개월차 랜딩페이지, 2개월차 모객 시스템, 3개월차 파트너십 — 3개월 후 완성된 수익 구조를 가져가실 수 있습니다.",
  },
  {
    q: "완주군까지 가야 하나요?",
    a: "오프라인/파트너 멤버십은 월 1~4회 완주군 현장에서 진행됩니다. 120평 CNC 공방과 실제 운영 중인 시스템을 직접 보는 것이 핵심 가치입니다. 온라인 멤버십은 어디서든 참여 가능합니다.",
  },
  {
    q: "환불 규정은 어떻게 되나요?",
    a: "첫 세션 참여 후 만족하지 못하시면 전액 환불해 드립니다. 약정 기간 중 해지 시 남은 기간에 대해 위약금 없이 정지 처리됩니다.",
  },
  {
    q: "파트너 수익 분배는 어떻게 이루어지나요?",
    a: "파트너 멤버가 새로운 회원을 소개하면, 해당 회원의 월 구독료에서 최대 40%를 매월 반복 수익으로 지급합니다. 소개한 회원이 유지하는 한 계속 수익이 발생합니다.",
  },
];

/* ─── HOOKS ─── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── COMPONENTS ─── */
function FadeIn({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function CurriculumCard({ item, index }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <FadeIn delay={index * 0.12}>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
        style={{
          background: "#fff",
          borderRadius: "18px",
          padding: "28px 24px",
          border: isOpen ? "1.5px solid #2D6A4F" : "1px solid #E8E5DC",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: isOpen ? "0 12px 40px rgba(27,67,50,0.1)" : "0 2px 12px rgba(0,0,0,0.04)",
          userSelect: "none",
          outline: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            fontSize: "12px", fontWeight: 800, color: "#2D6A4F",
            background: "rgba(45,106,79,0.08)", borderRadius: "8px",
            padding: "6px 10px", flexShrink: 0, letterSpacing: "0.05em",
          }}>
            {item.num}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "'Noto Serif KR', serif",
                fontSize: "18px", fontWeight: 700, color: "#1B1B18",
              }}>
                {item.icon} {item.title}
              </span>
              <span style={{
                fontSize: "11px", fontWeight: 700, color: "#40916C",
                background: "rgba(64,145,108,0.1)", padding: "3px 10px",
                borderRadius: "100px",
              }}>
                {item.tag}
              </span>
            </div>
          </div>
          <div style={{
            fontSize: "20px", color: isOpen ? "#2D6A4F" : "#B0B8B2",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease, color 0.3s ease",
            flexShrink: 0, lineHeight: 1,
          }}>
            ▾
          </div>
        </div>
        <p style={{
          fontSize: "14px", color: "#5A6A5E", lineHeight: 1.7,
          margin: "12px 0 0 0", paddingLeft: "42px",
        }}>
          {item.desc}
        </p>
        <div style={{
          overflow: "hidden",
          maxHeight: isOpen ? "300px" : "0px",
          opacity: isOpen ? 1 : 0,
          transition: "max-height 0.4s ease, opacity 0.3s ease 0.05s",
          paddingLeft: "42px",
        }}>
          <div style={{
            display: "flex", gap: "8px", flexWrap: "wrap",
            marginTop: "16px", paddingTop: "16px",
            borderTop: "1px dashed #D4D1C7",
          }}>
            {item.details.map((d, i) => (
              <span key={i} style={{
                fontSize: "13px", color: "#2D6A4F", fontWeight: 600,
                background: "rgba(45,106,79,0.06)", padding: "8px 14px",
                borderRadius: "8px", border: "1px solid rgba(45,106,79,0.1)",
              }}>
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

function FAQItem({ item, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FadeIn delay={index * 0.08}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(prev => !prev)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsOpen(prev => !prev); }}
        style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "20px 24px",
          border: isOpen ? "1.5px solid #2D6A4F" : "1px solid #E8E5DC",
          cursor: "pointer",
          transition: "all 0.3s ease",
          userSelect: "none",
          outline: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <span style={{ fontSize: "15px", fontWeight: 600, color: "#1B1B18", lineHeight: 1.5 }}>
            {item.q}
          </span>
          <span style={{
            fontSize: "18px", color: isOpen ? "#2D6A4F" : "#B0B8B2",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            flexShrink: 0,
          }}>
            ▾
          </span>
        </div>
        <div style={{
          overflow: "hidden",
          maxHeight: isOpen ? "200px" : "0px",
          opacity: isOpen ? 1 : 0,
          transition: "max-height 0.4s ease, opacity 0.3s ease 0.05s",
        }}>
          <p style={{
            fontSize: "14px", color: "#5A6A5E", lineHeight: 1.7,
            margin: "12px 0 0 0", paddingTop: "12px",
            borderTop: "1px dashed #E8E5DC",
          }}>
            {item.a}
          </p>
        </div>
      </div>
    </FadeIn>
  );
}

function TierCard({ tier, index, onCTAClick }) {
  const [hovered, setHovered] = useState(false);
  const isHL = tier.highlight;

  const handleCTA = useCallback(() => {
    onCTAClick(tier.id);
  }, [tier.id, onCTAClick]);

  return (
    <FadeIn delay={index * 0.1}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: isHL ? "linear-gradient(165deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)" : "#FAFAF7",
          borderRadius: "20px",
          padding: isHL ? "3px" : "0",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          transition: "transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease",
          boxShadow: hovered ? "0 20px 60px rgba(27,67,50,0.18)" : "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{
          background: isHL ? "linear-gradient(180deg, #0D1F17 0%, #132E1F 100%)" : "#FAFAF7",
          borderRadius: isHL ? "18px" : "20px",
          padding: "32px 28px",
          minHeight: "540px",
          display: "flex", flexDirection: "column",
          border: isHL ? "none" : "1px solid #E8E5DC",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "20px", right: "20px",
            background: tier.badgeColor, color: "#fff",
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
            padding: "5px 10px", borderRadius: "6px",
          }}>
            {tier.badge}
          </div>

          <div style={{ fontSize: "36px", marginBottom: "12px" }}>{tier.emoji}</div>

          <h3 style={{
            fontFamily: "'Noto Serif KR', serif", fontSize: "22px", fontWeight: 700,
            color: isHL ? "#E8E5DC" : "#1B1B18", margin: "0 0 4px 0", lineHeight: 1.3,
          }}>
            {tier.name}
          </h3>
          <p style={{
            fontSize: "13px", color: isHL ? "#95D5B2" : "#6B7B6E",
            margin: "0 0 20px 0", fontWeight: 500,
          }}>
            {tier.subtitle}
          </p>

          <div style={{ marginBottom: "16px" }}>
            <span style={{
              fontSize: "34px", fontWeight: 800,
              color: isHL ? "#B7E4C7" : "#1B4332", letterSpacing: "-0.02em",
            }}>
              {tier.price}
            </span>
            {tier.priceNote && (
              <span style={{ fontSize: "13px", color: isHL ? "#6B9E82" : "#8A9A8E", marginLeft: "8px" }}>
                {tier.priceNote}
              </span>
            )}
          </div>

          <div style={{
            background: isHL ? "rgba(183,228,199,0.08)" : "rgba(74,124,89,0.04)",
            borderRadius: "10px", padding: "10px 14px", marginBottom: "16px",
            borderLeft: `3px solid ${isHL ? "#95D5B2" : "#4A7C59"}`,
          }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: isHL ? "#95D5B2" : "#4A7C59", marginBottom: "2px" }}>
              📅 {tier.schedule}
            </div>
            <div style={{ fontSize: "12px", color: isHL ? "#6B9E82" : "#6B7B6E" }}>
              🎯 {tier.goal}
            </div>
          </div>

          <ul style={{
            listStyle: "none", padding: 0, margin: "0 0 0 0",
            display: "flex", flexDirection: "column", gap: "10px",
          }}>
            {tier.features.map((f, i) => (
              <li key={i} style={{
                fontSize: "13.5px", color: isHL ? "#D8F3DC" : "#3A4A3E",
                display: "flex", alignItems: "flex-start", gap: "8px", lineHeight: 1.5,
              }}>
                <span style={{ color: isHL ? "#95D5B2" : "#4A7C59", fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>✓</span>
                {f}
              </li>
            ))}
          </ul>

          {/* Bonus perks */}
          {tier.bonuses && tier.bonuses.length > 0 && (
            <div style={{
              marginTop: "14px", paddingTop: "14px",
              borderTop: `1px dashed ${isHL ? "rgba(149,213,178,0.3)" : "#E8E5DC"}`,
            }}>
              <div style={{
                fontSize: "11px", fontWeight: 700, color: isHL ? "#95D5B2" : "#2D6A4F",
                marginBottom: "8px", letterSpacing: "0.05em",
              }}>
                🎁 멤버 전용 혜택
              </div>
              {tier.bonuses.map((b, i) => (
                <div key={i} style={{
                  fontSize: "12.5px", color: isHL ? "#B7E4C7" : "#4A7C59",
                  display: "flex", alignItems: "center", gap: "6px", lineHeight: 1.6,
                }}>
                  <span style={{ fontSize: "10px" }}>★</span> {b}
                </div>
              ))}
            </div>
          )}

          <div style={{ flex: 1 }} />

          <button
            onClick={tier.soldOut ? undefined : handleCTA}
            disabled={tier.soldOut}
            style={{
              marginTop: "24px", width: "100%", padding: "14px 0", borderRadius: "12px",
              border: tier.soldOut ? "1.5px solid #CCC" : isHL ? "none" : "1.5px solid #2D6A4F",
              background: tier.soldOut ? "#E8E5DC" : isHL ? "linear-gradient(135deg, #40916C, #52B788)" : "transparent",
              color: tier.soldOut ? "#999" : isHL ? "#fff" : "#2D6A4F",
              fontSize: "15px", fontWeight: 700,
              cursor: tier.soldOut ? "not-allowed" : "pointer",
              transition: "all 0.25s ease", letterSpacing: "0.02em",
            }}
          >
            {tier.cta}
          </button>
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── MAIN ─── */
export default function DalpaengiMembership() {
  const [scrollY, setScrollY] = useState(0);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTiers = useCallback((e) => {
    e.preventDefault();
    document.getElementById("tiers")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleCTAClick = useCallback((tierId) => {
    setActiveModal(tierId);
  }, []);

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "#F5F4EF", minHeight: "100vh", color: "#1B1B18", overflowX: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />

      {/* ══════ HERO ══════ */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "40px 24px",
        background: "radial-gradient(ellipse at 30% 20%, rgba(74,124,89,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(45,106,79,0.06) 0%, transparent 50%)",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-120px", right: "-80px",
          width: "400px", height: "400px", borderRadius: "50%",
          border: "1px solid rgba(74,124,89,0.08)",
          transform: `translateY(${scrollY * 0.05}px)`,
        }} />

        <div style={{ maxWidth: "720px", position: "relative", zIndex: 1 }}>
          <FadeIn>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(74,124,89,0.08)", border: "1px solid rgba(74,124,89,0.15)",
              borderRadius: "100px", padding: "8px 20px", marginBottom: "32px",
              fontSize: "13px", fontWeight: 600, color: "#2D6A4F",
            }}>
              🐌 AI 자동화 수익 스터디 모임
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 style={{
              fontFamily: "'Noto Serif KR', serif",
              fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 900,
              lineHeight: 1.2, margin: "0 0 20px 0", letterSpacing: "-0.02em",
            }}>
              달팽이<br />
              <span style={{ color: "#2D6A4F" }}>멤버십 스터디</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p style={{ fontSize: "18px", lineHeight: 1.8, color: "#5A6A5E", maxWidth: "540px", margin: "0 auto 16px" }}>
              120평 CNC 공방과 60평 펜션을<br />
              <strong style={{ color: "#1B4332" }}>AI로 실제 자동화하고 있는</strong> 대표가<br />
              수익모델부터 마케팅 시스템까지 함께 만듭니다.
            </p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <p style={{ fontSize: "14px", color: "#8A9A8E", marginBottom: "36px" }}>
              이론이 아닌, 지금 돌아가고 있는 시스템을 공유합니다.
            </p>
          </FadeIn>

          <FadeIn delay={0.35}>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={scrollToTiers} style={{
                display: "inline-flex", alignItems: "center", padding: "16px 32px",
                background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
                color: "#fff", borderRadius: "14px", fontSize: "16px", fontWeight: 700,
                border: "none", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(27,67,50,0.25)",
              }}>
                멤버십 살펴보기 →
              </button>
              <button onClick={() => setActiveModal("letter")} style={{
                display: "inline-flex", alignItems: "center", padding: "16px 32px",
                background: "transparent", color: "#2D6A4F", borderRadius: "14px",
                fontSize: "16px", fontWeight: 600, border: "1.5px solid #2D6A4F", cursor: "pointer",
              }}>
                무료 레터 먼저 구독
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ SOCIAL PROOF ══════ */}
      <section style={{ padding: "60px 24px", background: "#1B4332" }}>
        <div style={{
          maxWidth: "900px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "28px", textAlign: "center",
        }}>
          {PROOF_ITEMS.map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div>
                <div style={{ fontSize: "32px", fontWeight: 800, color: "#B7E4C7" }}>{item.number}</div>
                <div style={{ fontSize: "13px", color: "#95D5B2", marginTop: "4px", fontWeight: 500 }}>{item.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════ RUNNING SYSTEMS — 차별화 포인트 ══════ */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#2D6A4F",
              background: "rgba(45,106,79,0.08)", padding: "6px 14px",
              borderRadius: "100px", marginBottom: "16px", letterSpacing: "0.05em",
            }}>
              다른 AI 스터디와의 결정적 차이
            </div>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "30px", fontWeight: 700,
              marginBottom: "12px",
            }}>
              지금 실제로 돌아가고 있는 시스템
            </h2>
            <p style={{ color: "#6B7B6E", fontSize: "15px", marginBottom: "48px", lineHeight: 1.7 }}>
              이론이 아닙니다. 아래 시스템들이 지금 이 순간에도<br />
              120평 공방과 60평 펜션에서 <strong style={{ color: "#1B4332" }}>24시간 자동으로 작동</strong>하고 있습니다.
            </p>
          </FadeIn>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}>
            {RUNNING_SYSTEMS.map((sys, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div style={{
                  background: "#FAFAF7", borderRadius: "14px", padding: "20px",
                  border: "1px solid #E8E5DC",
                  display: "flex", alignItems: "flex-start", gap: "14px",
                }}>
                  <div style={{
                    fontSize: "28px", flexShrink: 0,
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: "rgba(45,106,79,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {sys.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#1B1B18", marginBottom: "4px" }}>
                      {sys.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "#6B7B6E", lineHeight: 1.5 }}>
                      {sys.desc}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div style={{
              marginTop: "32px", textAlign: "center",
              background: "rgba(45,106,79,0.04)", borderRadius: "12px",
              padding: "16px 24px", border: "1px dashed rgba(45,106,79,0.2)",
            }}>
              <p style={{ fontSize: "14px", color: "#2D6A4F", fontWeight: 600, margin: 0 }}>
                이 모든 시스템을 직접 보고, 배우고, 만들 수 있습니다.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ FUNNEL JOURNEY ══════ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "30px", fontWeight: 700,
              textAlign: "center", marginBottom: "12px",
            }}>
              단계별 성장 여정
            </h2>
            <p style={{ textAlign: "center", color: "#6B7B6E", fontSize: "15px", marginBottom: "48px" }}>
              무료 레터부터 시작해서, 나만의 속도로 올라갑니다
            </p>
          </FadeIn>

          {FUNNEL_STEPS.map((step, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{
                display: "flex", alignItems: "center", gap: "20px",
                padding: "20px 0", borderBottom: i < 3 ? "1px solid #E8E5DC" : "none",
              }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px", background: step.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px", flexShrink: 0,
                }}>
                  {step.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "17px", fontWeight: 700 }}>{step.label}</span>
                    <span style={{
                      fontSize: "12px", fontWeight: 700, color: "#2D6A4F",
                      background: "rgba(45,106,79,0.08)", padding: "2px 10px",
                      borderRadius: "100px",
                    }}>
                      {step.price}
                    </span>
                  </div>
                  <div style={{ fontSize: "14px", color: "#6B7B6E", marginTop: "2px" }}>{step.sub}</div>
                </div>
                {i < 3 && <div style={{ fontSize: "18px", color: "#95D5B2", fontWeight: 700 }}>→</div>}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════ CURRICULUM ══════ */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#2D6A4F",
              background: "rgba(45,106,79,0.08)", padding: "6px 14px",
              borderRadius: "100px", marginBottom: "16px", letterSpacing: "0.05em",
            }}>
              오프라인 멤버십 핵심 커리큘럼
            </div>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "30px", fontWeight: 700, marginBottom: "12px",
            }}>
              현장에서 만들고, 가져간다
            </h2>
            <p style={{ color: "#6B7B6E", fontSize: "15px", marginBottom: "40px", lineHeight: 1.7 }}>
              매달 1회, 120평 CNC 공방에서 이론과 실습을 병행합니다.<br />
              돌아갈 때는 완성된 결과물을 손에 들고 갑니다.
              <br /><br />
              <span style={{ color: "#2D6A4F", fontWeight: 600 }}>▾ 각 항목을 클릭하면 상세 내용이 펼쳐집니다</span>
            </p>
          </FadeIn>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {CURRICULUM.map((item, i) => (
              <CurriculumCard key={item.num} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TIER CARDS ══════ */}
      <section id="tiers" style={{
        padding: "80px 24px 100px",
        background: "linear-gradient(180deg, #F5F4EF 0%, #EBE9E1 100%)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "32px", fontWeight: 700,
              textAlign: "center", marginBottom: "12px",
            }}>
              나에게 맞는 멤버십 선택
            </h2>
            <p style={{ textAlign: "center", color: "#6B7B6E", fontSize: "15px", marginBottom: "52px" }}>
              달팽이처럼 천천히, 하지만 확실하게
            </p>
          </FadeIn>

          {/* Lv.1 달팽이레터 — 가로 풀 배너 */}
          {(() => {
            const letterTier = TIERS.find(t => t.id === "letter");
            return (
              <FadeIn>
                <div
                  onClick={() => handleCTAClick("letter")}
                  style={{
                    background: "#FAFAF7", borderRadius: "20px", padding: "32px 36px",
                    border: "1px solid #E8E5DC", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap",
                    transition: "box-shadow 0.3s ease",
                    marginBottom: "20px",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 12px 40px rgba(27,67,50,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                >
                  <div style={{
                    fontSize: "40px", flexShrink: 0,
                    width: "72px", height: "72px", borderRadius: "18px",
                    background: "rgba(74,124,89,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {letterTier.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: "11px", fontWeight: 800, color: "#fff",
                        background: letterTier.badgeColor, padding: "3px 10px",
                        borderRadius: "6px", letterSpacing: "0.05em",
                      }}>
                        {letterTier.badge}
                      </span>
                      <h3 style={{
                        fontFamily: "'Noto Serif KR', serif",
                        fontSize: "22px", fontWeight: 700, color: "#1B1B18", margin: 0,
                      }}>
                        {letterTier.name}
                      </h3>
                    </div>
                    <p style={{ fontSize: "14px", color: "#6B7B6E", margin: "4px 0 10px", lineHeight: 1.5 }}>
                      {letterTier.subtitle}
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {letterTier.features.map((f, i) => (
                        <span key={i} style={{
                          fontSize: "12px", color: "#2D6A4F", fontWeight: 600,
                          background: "rgba(45,106,79,0.06)", padding: "5px 12px",
                          borderRadius: "8px", border: "1px solid rgba(45,106,79,0.1)",
                        }}>
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: "32px", fontWeight: 800, color: "#1B4332", marginBottom: "4px" }}>
                      {letterTier.price}
                    </div>
                    <button style={{
                      marginTop: "8px", padding: "12px 32px", borderRadius: "10px",
                      background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
                      color: "#fff", fontSize: "14px", fontWeight: 700,
                      border: "none", cursor: "pointer",
                    }}>
                      {letterTier.cta}
                    </button>
                  </div>
                </div>
              </FadeIn>
            );
          })()}

          {/* Lv.2~4 — 3열 그리드 */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px", alignItems: "start",
          }}>
            {TIERS.filter(t => !t.soldOut && t.id !== "letter").map((tier, i) => (
              <TierCard key={tier.id} tier={tier} index={i} onCTAClick={handleCTAClick} />
            ))}
          </div>

          {/* Lv.5 커스텀 — 가로 풀 배너 */}
          {TIERS.filter(t => t.soldOut).map((tier) => (
            <FadeIn key={tier.id} delay={0.5}>
              <div style={{
                marginTop: "32px",
                background: "linear-gradient(135deg, #0D1F17 0%, #1B4332 50%, #2D6A4F 100%)",
                borderRadius: "20px", padding: "36px 40px",
                display: "flex", alignItems: "center", gap: "32px",
                flexWrap: "wrap", position: "relative", overflow: "hidden",
              }}>
                {/* SOLD OUT 리본 */}
                <div style={{
                  position: "absolute", top: "18px", right: "24px",
                  background: "#D32F2F", color: "#fff",
                  fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em",
                  padding: "6px 16px", borderRadius: "6px",
                }}>
                  SOLD OUT
                </div>

                {/* 아이콘 + 레벨 */}
                <div style={{
                  fontSize: "48px", flexShrink: 0,
                  width: "80px", height: "80px", borderRadius: "20px",
                  background: "rgba(183,228,199,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {tier.emoji}
                </div>

                {/* 정보 */}
                <div style={{ flex: 1, minWidth: "240px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: "12px", fontWeight: 800, color: "#B7E4C7",
                      background: "rgba(183,228,199,0.15)", padding: "4px 12px",
                      borderRadius: "6px", letterSpacing: "0.05em",
                    }}>
                      {tier.level}
                    </span>
                    <h3 style={{
                      fontFamily: "'Noto Serif KR', serif",
                      fontSize: "24px", fontWeight: 700, color: "#E8E5DC", margin: 0,
                    }}>
                      {tier.name}
                    </h3>
                  </div>
                  <p style={{ fontSize: "15px", color: "#95D5B2", margin: "0 0 12px", lineHeight: 1.6 }}>
                    {tier.subtitle}
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {tier.features.slice(0, 4).map((f, i) => (
                      <span key={i} style={{
                        fontSize: "12px", color: "#B7E4C7", fontWeight: 600,
                        background: "rgba(183,228,199,0.08)", padding: "6px 12px",
                        borderRadius: "8px", border: "1px solid rgba(183,228,199,0.15)",
                      }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 가격 */}
                <div style={{ textAlign: "center", flexShrink: 0, minWidth: "140px" }}>
                  <div style={{ fontSize: "32px", fontWeight: 800, color: "#B7E4C7", marginBottom: "4px" }}>
                    {tier.price}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6B9E82" }}>{tier.priceNote}</div>
                  <button disabled style={{
                    marginTop: "16px", padding: "12px 32px", borderRadius: "10px",
                    background: "#E8E5DC", color: "#999", fontSize: "14px", fontWeight: 700,
                    border: "none", cursor: "not-allowed", letterSpacing: "0.05em",
                  }}>
                    SOLD OUT
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════ MEMBER PERKS — "안 하면 손해" 혜택 ══════ */}
      <section style={{ padding: "80px 24px", background: "#1B4332" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "28px", fontWeight: 700,
              textAlign: "center", marginBottom: "12px", color: "#E8E5DC",
            }}>
              안 하면 손해 — 멤버 전용 혜택
            </h2>
            <p style={{ textAlign: "center", color: "#95D5B2", fontSize: "15px", marginBottom: "48px" }}>
              멤버십 요금 이상의 가치를 돌려받습니다
            </p>
          </FadeIn>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}>
            {MEMBER_PERKS.map((perk, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div style={{
                  background: "rgba(255,255,255,0.06)", borderRadius: "14px",
                  padding: "20px", border: "1px solid rgba(149,213,178,0.15)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "24px" }}>{perk.icon}</span>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#D8F3DC" }}>{perk.title}</div>
                      <span style={{
                        fontSize: "10px", fontWeight: 700, color: "#95D5B2",
                        background: "rgba(149,213,178,0.15)", padding: "2px 8px",
                        borderRadius: "100px",
                      }}>
                        {perk.tier}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: "13px", color: "#95D5B2", margin: 0, lineHeight: 1.5 }}>
                    {perk.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ COMPARISON TABLE ══════ */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "28px", fontWeight: 700,
              textAlign: "center", marginBottom: "40px",
            }}>
              한눈에 비교
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "760px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #1B4332" }}>
                    {["", "📬 Lv.1", "💻 Lv.2", "🔧 Lv.3", "🚀 Lv.4", "👑 Lv.5"].map((h, i) => (
                      <th key={i} style={{
                        padding: "12px 8px", textAlign: i === 0 ? "left" : "center",
                        fontWeight: 700, color: "#1B4332", fontSize: "13px",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["가격", "무료", "₩9,900/월", "₩99,000/월", "₩990,000/월", "금액 협의"],
                    ["빈도", "주 2회", "주 1회 2시간", "월 1회 원데이", "주 1회 8시간", "맞춤 일정"],
                    ["형태", "뉴스레터", "온라인 라이브", "오프라인 실습", "오프라인 밀착", "풀 셋팅"],
                    ["AI 트렌드 뉴스", "✓", "✓", "✓", "✓", "✓"],
                    ["라이브 시연", "—", "✓", "✓", "✓", "✓"],
                    ["이론+실습 결과물", "—", "—", "✓", "✓", "✓"],
                    ["수익모델 설계", "—", "—", "—", "✓", "✓"],
                    ["마케팅 시스템 구축", "—", "—", "—", "✓", "✓"],
                    ["풀 시스템 셋팅", "—", "—", "—", "—", "✓"],
                    ["펜션·공방 혜택", "—", "—", "할인 이용", "무료 이용", "무료 이용"],
                    ["수익 분배 파트너십", "—", "—", "—", "최대 40%", "✓"],
                    ["최소 약정", "없음", "없음", "3개월", "3개월", "협의"],
                    ["정원", "무제한", "1,000명", "20명", "20명", "SOLD OUT"],
                  ].map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: "1px solid #E8E5DC", background: ri % 2 === 0 ? "#FAFAF7" : "#fff" }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{
                          padding: "12px 8px", textAlign: ci === 0 ? "left" : "center",
                          fontWeight: ci === 0 ? 600 : 400,
                          color: cell === "✓" ? "#2D6A4F" : cell === "—" ? "#CCC" : "#3A4A3E",
                          fontSize: cell === "✓" ? "16px" : "13px",
                        }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section style={{ padding: "80px 24px", background: "#F5F4EF" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "28px", fontWeight: 700,
              textAlign: "center", marginBottom: "12px",
            }}>
              자주 묻는 질문
            </h2>
            <p style={{ textAlign: "center", color: "#6B7B6E", fontSize: "15px", marginBottom: "40px" }}>
              궁금한 점이 있으시면 카카오톡으로 편하게 문의해주세요
            </p>
          </FadeIn>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ HOST ══════ */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🐌</div>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "28px", fontWeight: 700, margin: "0 0 20px",
            }}>
              운영자 · 임솔 (Sol)
            </h2>
            <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#5A6A5E", maxWidth: "560px", margin: "0 auto 28px" }}>
              120평 CNC 공방과 60평 독채 펜션을 직접 운영하면서,<br />
              n8n · Supabase · Claude API · React를 활용해<br />
              <strong style={{ color: "#1B4332" }}>예약부터 마케팅까지 전 과정을 AI로 자동화</strong>하고 있습니다.<br /><br />
              7년간의 호스팅 경험과 에어비앤비 평점 5.0,<br />
              서울이 아닌 완주에서 만들어낸 자동화 성공 사례.<br />
              현재진행형 실험의 모든 것을 공유합니다.
            </p>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:01085319531" style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "#FAFAF7", padding: "10px 20px", borderRadius: "10px",
                fontSize: "14px", fontWeight: 500, color: "#3A4A3E",
                border: "1px solid #E8E5DC", textDecoration: "none",
              }}>
                📞 010-8531-9531
              </a>
              <a href="https://open.kakao.com/o/sool9241" target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "#FAFAF7", padding: "10px 20px", borderRadius: "10px",
                fontSize: "14px", fontWeight: 500, color: "#3A4A3E",
                border: "1px solid #E8E5DC", textDecoration: "none",
              }}>
                💬 카카오톡 sool9241
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section style={{
        padding: "80px 24px",
        background: "linear-gradient(165deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)",
        textAlign: "center",
      }}>
        <FadeIn>
          <h2 style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 700,
            color: "#fff", marginBottom: "12px", lineHeight: 1.4,
          }}>
            더디더라도 달팽이처럼 천천히,<br />
            하지만 확실한 수익 구조를 만들어갑니다.
          </h2>
          <p style={{ fontSize: "16px", color: "#B7E4C7", marginBottom: "36px", lineHeight: 1.7 }}>
            무료 달팽이레터로 먼저 시작해보세요.<br />
            매주 2회, 최신 AI 트렌드를 전해드립니다.
          </p>
          <button onClick={() => setActiveModal("letter")} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "18px 40px", background: "#fff", color: "#1B4332",
            borderRadius: "14px", fontSize: "17px", fontWeight: 800,
            border: "none", cursor: "pointer",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}>
            🐌 달팽이레터 무료 구독하기
          </button>
        </FadeIn>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer style={{ padding: "40px 24px", background: "#0D1F17", textAlign: "center" }}>
        <p style={{ fontSize: "13px", color: "#6B9E82", margin: "0 0 8px" }}>
          달팽이 멤버십 스터디 · 운영: 임솔 (StoryFarm)
        </p>
        <p style={{ fontSize: "12px", color: "#3A5A45", margin: 0 }}>
          전북 완주군 소양면 해월리 866-6 · 010-8531-9531
        </p>
      </footer>

      {/* ══════ MODALS ══════ */}
      <NewsletterSignupModal
        isOpen={activeModal === "letter"}
        onClose={() => setActiveModal(null)}
      />
      <MembershipApplyModal
        isOpen={activeModal === "online" || activeModal === "offline" || activeModal === "partner"}
        onClose={() => setActiveModal(null)}
        tierId={activeModal || "online"}
      />
    </div>
  );
}
