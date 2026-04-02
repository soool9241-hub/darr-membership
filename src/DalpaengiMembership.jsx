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
    grade: "달팽이 친구",
    subtitle: "주간 라이브 + 커뮤니티 + 템플릿으로 AI 자동화를 익힙니다",
    price: "₩29,900",
    priceNote: "월 / 레터 구독자 첫 달 50% → ₩14,950",
    badge: "Lv.2",
    badgeColor: "#2D6A4F",
    schedule: "주 1회 라이브 + 월 1회 Q&A",
    goal: "실제 돌아가는 자동화 시스템을 눈으로 확인하고 따라 만든다",
    features: [
      "주 1회 라이브 시연 세션 (녹화본 제공)",
      "전용 커뮤니티 (카카오 오픈채팅 / 디스코드)",
      "월간 자동화 템플릿 팩 (n8n JSON + 구글 시트)",
      "월 1회 Q&A 라이브 (질의응답 전용)",
      "신규 AI 도구 얼리 액세스 리뷰",
      "부트캠프 · 오프라인 10% 할인",
    ],
    bonuses: ["첫 30일 집중 온보딩 커리큘럼"],
    cta: "온라인 멤버십 시작",
    highlight: false,
  },
  {
    id: "pro",
    level: "Lv.3",
    emoji: "🔧",
    name: "프로 멤버십",
    grade: "달팽이 주민",
    subtitle: "소그룹 코칭 + 오프라인 실습으로 직접 만들고 결과를 냅니다",
    price: "₩199,000",
    priceNote: "월 / 정기결제",
    badge: "Lv.3",
    badgeColor: "#1B4332",
    schedule: "월 1회 오프라인 + 월 2회 소그룹 코칭",
    goal: "현장에서 직접 만들고, 완성된 결과물을 가져간다",
    features: [
      "온라인 멤버십 전체 혜택 포함",
      "월 1회 오프라인 종일 워크샵 (120평 CNC 공방)",
      "월 2회 소그룹 코칭 (5명 단위, 화상 60분)",
      "구축 대행 15% 할인",
      "파트너 멤버십 우선 대기 자격",
      "전용 네트워킹 채널",
    ],
    bonuses: ["펜션 20% 할인", "공방 시설 무료 이용"],
    cta: "프로 멤버십 신청",
    highlight: true,
  },
  {
    id: "partner",
    level: "Lv.4",
    emoji: "🚀",
    name: "파트너 멤버십",
    grade: "달팽이 가족",
    subtitle: "1:1 코칭으로 자동화 수익 시스템을 완전히 구축합니다",
    price: "₩990,000",
    priceNote: "월 / 20명 한정 (대기 리스트)",
    badge: "Lv.4",
    badgeColor: "#081C15",
    schedule: "주 1회 1:1 코칭 (60분) + 실시간 QA",
    goal: "수익모델 설계부터 마케팅 시스템까지 완전 구축",
    features: [
      "주 1회 1:1 화상 코칭 (60분)",
      "전용 카톡 채널 실시간 QA",
      "자동화 시스템 공동 설계",
      "구축 대행 20% 할인",
      "분기 1회 파트너 전용 오프라인 네트워킹",
      "온라인 + 프로 멤버십 전체 포함",
    ],
    bonuses: ["펜션 무료 이용", "공방 시설 무료 이용", "수익 분배 파트너십 참여 (최대 40%)"],
    cta: "파트너 멤버십 문의",
    highlight: false,
  },
];

const BOOTCAMP = {
  emoji: "🎓",
  name: "퍼널구축 아카데미",
  subtitle: "8주 만에 내 사업의 자동화 퍼널을 완성합니다.\n기술이 아니라 \"매출이 나는 구조\"를 만드는 과정.",
  longDesc: "n8n도, Supabase도, 코딩도 몰라도 됩니다.\n\"내 가게에 손님이 알아서 오고, 문자가 알아서 나가고, 리뷰가 알아서 쌓이는 구조\"\n그걸 8주 만에 직접 만듭니다.",
  price: "₩990,000",
  priceNote: "30명 한정 | 온라인 주 2회 (화·목 저녁 8시, 90분) + 오프라인 OT/졸업식",
  schedule: "온라인 주 2회 (화·목 저녁 8시, 90분) + 오프라인 OT/졸업식",
  nextTerm: "3기 모집 중 (9월 개강)",
  curriculum: [
    { week: "1주차", title: "자동화 설계 사고법", task: "내 사업 자동화 포인트 10개 도출" },
    { week: "2주차", title: "n8n 기초 + 첫 워크플로우", task: "구글 시트 → SMS 자동 발송" },
    { week: "3주차", title: "Supabase 데이터베이스", task: "고객 DB 설계 + API 연동" },
    { week: "4주차", title: "고객 여정 자동화", task: "예약 → 안내 → 감사 전체 플로우" },
    { week: "5주차", title: "마케팅 자동화", task: "콘텐츠 자동 생성 + 예약 게시" },
    { week: "6주차", title: "AI 에이전트 설계", task: "Claude API 활용 자동 응답 시스템" },
    { week: "7주차", title: "대시보드 + 모니터링", task: "Vercel 배포 + 실시간 현황판" },
    { week: "8주차", title: "최종 프로젝트 발표", task: "내 사업에 적용한 자동화 시스템 시연" },
  ],
  benefits: [
    "온라인 멤버십 3개월 무료 포함",
    "온라인 멤버십 회원 10% 할인 (89.1만원)",
    "5명 이상 단체 등록 20% 할인",
    "졸업 후 프로 멤버십 전환 우대",
  ],
};

const DFY_PACKAGES = [
  {
    name: "스타터",
    emoji: "🌱",
    price: "300만원",
    period: "납기 2주",
    desc: "우리 사업의 첫 번째 온라인 거점을 만듭니다",
    target: "홈페이지가 없거나 제대로 된 랜딩페이지가 필요한 사장님",
    includes: [
      "반응형 랜딩페이지 1개 (Vercel 배포)",
      "문의 폼 + 카톡/이메일 자동 알림",
      "기본 SEO 세팅 + SSL 인증서",
      "유입 퍼널 설계서 (PDF)",
      "무료 미끼 기획안 + CTA 카피 3종",
      "관리 가이드 + 1개월 무상 AS",
    ],
  },
  {
    name: "비즈니스",
    emoji: "🚀",
    price: "600만원",
    period: "납기 3주",
    desc: "고객이 알아서 찾아오고, 시스템이 알아서 관리합니다",
    target: "예약/주문 관리에 시간을 뺏기고 있는 사장님",
    popular: true,
    includes: [
      "랜딩페이지 + 갤러리 + 네이버 지도",
      "Supabase 고객 DB 구축",
      "SMS/카톡 자동 발송 (예약확인·방문안내·감사)",
      "7일 이메일 자동 시퀀스",
      "리뷰 자동 수집 시스템",
      "퍼널 설계서 + 실행 가이드",
      "1시간 인수인계 교육 + 1개월 무상 AS",
    ],
  },
  {
    name: "프리미엄",
    emoji: "💎",
    price: "900만원",
    period: "납기 4주",
    desc: "데이터가 쌓이고, 시스템이 분석하고, 리포트가 알아서 옵니다",
    target: "시스템으로 사업을 굴리고 싶은 대표님",
    includes: [
      "웹사이트 최대 5페이지 + 예약/결제 연동",
      "Supabase 풀 DB + 관리자 대시보드",
      "SMS/카톡 고객 여정 전체 자동화",
      "7일 + 14일 이메일 시퀀스",
      "AI 자동 응답 챗봇 (24시간)",
      "주간 + 월간 AI 인사이트 리포트 자동 발송",
      "리텐션 자동화 (이탈 방지)",
      "풀 퍼널 매뉴얼 + 2시간 인수인계 + 1개월 무상 AS",
    ],
  },
];

const DFY_ADDONS = [
  { name: "카카오 비즈채널 세팅", price: "+100만원" },
  { name: "네이버 검색광고 세팅", price: "+80만원" },
  { name: "SNS 콘텐츠 자동 생성", price: "+120만원" },
  { name: "경쟁사 모니터링 봇", price: "+100만원" },
];

const MAINTENANCE_PLANS = [
  { name: "기본 유지보수", price: "30만원/월", desc: "무제한 수정 + 장애 대응 (24시간 내) + 시스템 모니터링" },
  { name: "성장 관리", price: "50만원/월", desc: "기본 유지보수 + 월 1회 데이터 분석 미팅 (30분, 줌)" },
  { name: "전담 운영", price: "100만원/월", desc: "성장 관리 + SNS 콘텐츠 + 광고 최적화 + 분기 퍼널 점검" },
];

const FREE_RESOURCES = [
  { emoji: "📋", name: "소상공인 자동화 체크리스트", desc: "내 사업에서 자동화할 수 있는 포인트 20가지", type: "PDF" },
  { emoji: "🎬", name: "n8n 첫걸음 30분 무료 강의", desc: "자동화가 뭔지 30분 만에 이해하기", type: "영상" },
  { emoji: "📊", name: "매출 2배 만드는 퍼널 템플릿", desc: "검증된 자동화 퍼널 구조를 바로 적용", type: "구글 시트" },
];

const DIGITAL_PRODUCTS = [
  {
    emoji: "📅", name: "예약 자동화 시스템", price: "월 29,000원", priceYear: "연 348,000원",
    type: "SaaS", status: "soldout",
    desc: "달팽이 아지트 펜션에서 7년간 실제 운영하며 검증한 예약 시스템을 그대로 제공합니다. 에어비앤비 5.0 평점을 유지할 수 있었던 비결 — 예약부터 퇴실까지 단 하나의 문자도 빠뜨리지 않는 자동 안내 시스템입니다. 설치 후 사장님이 할 일은 예약 확인 버튼 하나 누르는 것뿐입니다.",
    tagline: "예약 접수부터 안내 문자까지 알아서",
    target: "예약 문자 수동 발송에 하루 1시간 쓰시는 사장님",
  },
  {
    emoji: "💬", name: "AI 고객 응대 챗봇", price: "월 39,000원", priceYear: "연 468,000원",
    type: "SaaS", status: "soldout",
    desc: "밤 11시에 들어오는 문의도 AI가 즉시 응대합니다. \"주차 가능한가요?\", \"반려동물 동반 되나요?\" 같은 반복 질문은 AI가 자동 답변하고, 복잡한 건 사장님 카톡으로 바로 전달합니다. 놓치는 문의 0건이 목표입니다.",
    tagline: "24시간 자동 응대. 복잡한 건 사장님에게 전달",
    target: "영업시간 지났는데 문의 놓치시는 사장님",
  },
  {
    emoji: "📊", name: "매출 대시보드", price: "월 19,000원", priceYear: "연 228,000원",
    type: "SaaS", status: "coming",
    desc: "폰 하나로 사업 전체를 봅니다. 아침에 커피 마시면서 \"어제 매출 얼마지?\" 하고 열면 바로 보이고, 매주 월요일 아침에 지난주 요약이 카톡으로 옵니다. 전년 같은 달과 자동 비교해서 인사이트도 알려줍니다. 감이 아니라 숫자로 장사하세요.",
    tagline: "폰으로 매출/예약/고객 현황 한눈에",
    target: "이번 달 매출이 얼마인지 엑셀 뒤져야 아는 사장님",
  },
  {
    emoji: "⭐", name: "리뷰 자동 수집 시스템", price: "월 19,000원", priceYear: "연 228,000원",
    type: "SaaS", status: "coming",
    desc: "에어비앤비 평점 5.0을 7년간 유지한 비결입니다. 퇴실 다음 날 자동으로 리뷰 요청이 나가고, 별점 4점 이상이면 네이버/구글 리뷰로 연결됩니다. 3점 이하면 외부 노출 전에 내부 피드백으로 전환해서 사장님이 먼저 대응할 수 있습니다.",
    tagline: "좋은 리뷰는 네이버로, 나쁜 건 내부로",
    target: "리뷰 부탁드려요 말하기 민망한 사장님",
  },
  {
    emoji: "📩", name: "자동 문자/카톡 발송", price: "월 25,000원", priceYear: "연 300,000원 + 문자비 별도",
    type: "SaaS", status: "coming",
    desc: "65명에게 1분 만에 맞춤 문자를 보낸 실전 시스템입니다. 생일에 축하 문자, 30일 넘게 안 오신 분에게 리텐션 메시지가 자동 발송됩니다. 단골을 놓치지 마세요.",
    tagline: "고객별 맞춤 문자가 시점에 맞춰 자동 발송",
    target: "단골한테 연락하고 싶은데 너무 많은 사장님",
  },
  {
    emoji: "📄", name: "견적서 자동 생성", price: "월 29,000원", priceYear: "연 348,000원",
    type: "SaaS", status: "coming",
    desc: "120평 CNC 공방에서 직접 쓰고 있는 견적 시스템입니다. 항목 선택하면 자동 계산, 로고 들어간 PDF 견적서 즉시 생성, 고객 카톡 자동 발송까지. 견적서 만드는 데 30분 걸리던 게 1분이 됩니다.",
    tagline: "항목 선택하면 견적서 즉시 생성. PDF 발송까지 자동",
    target: "견적서 하나 만드는 데 30분 걸리는 사장님",
  },
];

const CURRICULUM = [
  {
    num: "01",
    icon: "🖥️",
    title: "팔리는 랜딩페이지 구축",
    tag: "바이브 코딩 · 6시간",
    desc: "코딩을 몰라도 AI와 함께 바이브 코딩으로 전환율 높은 랜딩페이지를 직접 만들고 배포합니다.",
    details: ["React + Vercel 배포", "전환율 높은 구조 설계", "AI 코파일럿 활용 실습"],
  },
  {
    num: "02",
    icon: "🤖",
    title: "나 대신 일하는 모객 시스템 구축",
    tag: "AI 시스템 · 광고 · 6시간",
    desc: "AI 시스템과 광고 채널을 연결해 24시간 자동으로 고객을 모으고 전환시키는 시스템을 구축합니다.",
    details: ["AI 에이전트 & n8n 자동화", "네이버 광고 · 유튜브 광고", "인스타그램 · 페이스북 광고"],
  },
  {
    num: "03",
    icon: "📊",
    title: "운영관리 AI 효율화",
    tag: "관리자 페이지 · 데이터 · 6시간",
    desc: "관리자 페이지를 고도화하고, 데이터 기반으로 운영을 자동화하는 시스템을 만듭니다.",
    details: ["관리자 페이지 고도화", "데이터 기반 의사결정", "운영 자동화 파이프라인"],
  },
  {
    num: "04",
    icon: "🤝",
    title: "나 대신 팔아줄 마케터 100명 만드는 노하우",
    tag: "파트너십 시스템 · 6시간",
    desc: "혼자 팔지 않아도 매출이 오르는 구조. 파트너십 시스템을 직접 만들어갑니다.",
    details: ["파트너 모집 & 관리 시스템", "수익 분배 자동화", "확장 가능한 영업 구조"],
  },
];

const PROOF_ITEMS = [
  { number: "60평", label: "펜션 운영" },
  { number: "120평", label: "CNC 공방 운영" },
  { number: "24시간", label: "자동화 시스템 구축" },
  { number: "100개", label: "AI 에이전트 운영 중" },
  { number: "바이브코딩", label: "워크샵 진행" },
  { number: "1,000+", label: "누적 시제품 제작" },
];

const FUNNEL_STEPS = [
  {
    step: "STEP 1", emoji: "📬", label: "무료 자료 받기",
    sub: "뉴스레터 구독 시 자동화 체크리스트 · 무료 강의 · 퍼널 템플릿을 바로 보내드립니다",
    price: "무료", color: "#95D5B2",
    detail: "이미 5,000+명의 사장님이 받아보고 있습니다",
  },
  {
    step: "STEP 2", emoji: "📦", label: "가볍게 시작하기",
    sub: "VOD 강의나 자동화 템플릿으로 내 사업에 바로 적용해보세요",
    price: "₩29,000~", color: "#74C69D",
    detail: "7일 자동 가이드가 활용법을 안내해드립니다",
  },
  {
    step: "STEP 3", emoji: "💻", label: "함께 성장하기",
    sub: "주간 라이브 · 커뮤니티 · 템플릿과 함께 꾸준히 실력을 쌓아가세요",
    price: "₩29,900/월", color: "#52B788",
    detail: "800명이 매주 함께 배우고 있습니다 · 첫 달 50% 할인",
  },
  {
    step: "STEP 4", emoji: "🔧", label: "직접 만들어보기",
    sub: "소그룹 코칭과 오프라인 실습으로 내 결과물을 완성하세요",
    price: "₩199,000/월", color: "#2D6A4F",
    detail: "5명 단위 밀착 코칭 · 월 1회 현장 워크샵",
  },
  {
    step: "STEP 5", emoji: "🚀", label: "수익 시스템 완성",
    sub: "1:1 코칭으로 자동화 수익 구조를 구축하거나, 통째로 맡기세요",
    price: "₩990,000/월~", color: "#1B4332",
    detail: "파트너 멤버십 또는 구축 대행 중 선택",
  },
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
  { icon: "🏡", title: "독채 펜션 할인", desc: "프로 멤버 20% / 파트너 멤버 무료 이용", tier: "프로+" },
  { icon: "🔧", title: "CNC 공방 무료 이용", desc: "120평 공방 시설 & 장비 자유 이용", tier: "프로+" },
  { icon: "🛠️", title: "신규 AI 도구 우선 체험", desc: "새로운 자동화 도구 출시 시 멤버 우선 공개", tier: "온라인+" },
  { icon: "💰", title: "수익 분배 파트너십", desc: "멤버 소개 시 반복 수익 분배 (최대 40%)", tier: "파트너" },
  { icon: "👥", title: "소그룹 코칭", desc: "5명 단위 밀착 코칭 — 월 2회 화상 60분", tier: "프로+" },
  { icon: "📋", title: "구축 대행 할인", desc: "프로 15% · 파트너 20% 할인 적용", tier: "프로+" },
];

const FAQ_ITEMS = [
  {
    q: "코딩을 전혀 몰라도 참여할 수 있나요?",
    a: "네, 바이브 코딩은 AI와 대화하면서 코드를 만드는 방식입니다. 코딩 경험이 전혀 없어도 당일 결과물을 완성할 수 있도록 설계했습니다.",
  },
  {
    q: "온라인 멤버십만으로도 충분한가요?",
    a: "온라인 멤버십은 라이브 시연, 커뮤니티, 템플릿으로 충분히 배울 수 있습니다. 직접 코칭 받으며 결과물을 만들고 싶다면 프로, 수익 시스템을 완전히 구축하고 싶다면 파트너 멤버십을 추천합니다.",
  },
  {
    q: "기존 9,900원에서 29,900원으로 왜 인상되었나요?",
    a: "주간 라이브(녹화본 제공), 전용 커뮤니티, 월간 자동화 템플릿 팩, Q&A 라이브 등 기존 대비 5배 이상의 가치가 추가되었습니다. 레터 구독자는 첫 달 50% 할인(14,950원)으로 시작할 수 있습니다.",
  },
  {
    q: "프로 멤버십과 부트캠프의 차이가 뭔가요?",
    a: "프로 멤버십은 월 구독형으로 꾸준히 소그룹 코칭과 오프라인 워크샵에 참여합니다. 부트캠프는 8주 집중 과정으로, 내 사업에 맞는 자동화 시스템을 처음부터 끝까지 완성하는 프로그램입니다.",
  },
  {
    q: "구축 대행은 어떻게 진행되나요?",
    a: "30분 무료 상담 → 요구사항 정의 → 견적 발행 → 계약금 50% → 구축 (2~4주) → 인수인계 교육 → 잔금 50% 순으로 진행됩니다. 멤버십 회원은 15~20% 할인이 적용됩니다.",
  },
  {
    q: "완주군까지 가야 하나요?",
    a: "프로 멤버십 오프라인 워크샵은 월 1회 완주군에서 진행됩니다. 소그룹 코칭은 화상으로 진행되며, 온라인 멤버십은 어디서든 참여 가능합니다.",
  },
  {
    q: "환불 규정은 어떻게 되나요?",
    a: "7일 내 전액 환불 원칙입니다. 첫 세션 참여 후 만족하지 못하시면 전액 환불해 드립니다. 약정 기간 중 해지 시 남은 기간에 대해 위약금 없이 정지 처리됩니다.",
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
  const handleClick = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <FadeIn delay={index * 0.12}>
      <div
        role="button" tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
        style={{
          background: "#fff", borderRadius: "18px", padding: "28px 24px",
          border: isOpen ? "1.5px solid #2D6A4F" : "1px solid #E8E5DC",
          cursor: "pointer", transition: "all 0.3s ease",
          boxShadow: isOpen ? "0 12px 40px rgba(27,67,50,0.1)" : "0 2px 12px rgba(0,0,0,0.04)",
          userSelect: "none", outline: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            fontSize: "12px", fontWeight: 800, color: "#2D6A4F",
            background: "rgba(45,106,79,0.08)", borderRadius: "8px",
            padding: "6px 10px", flexShrink: 0, letterSpacing: "0.05em",
          }}>{item.num}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "18px", fontWeight: 700, color: "#1B1B18" }}>
                {item.icon} {item.title}
              </span>
              <span style={{
                fontSize: "11px", fontWeight: 700, color: "#40916C",
                background: "rgba(64,145,108,0.1)", padding: "3px 10px", borderRadius: "100px",
              }}>{item.tag}</span>
            </div>
          </div>
          <div style={{
            fontSize: "20px", color: isOpen ? "#2D6A4F" : "#B0B8B2",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease, color 0.3s ease", flexShrink: 0, lineHeight: 1,
          }}>▾</div>
        </div>
        <p style={{ fontSize: "14px", color: "#5A6A5E", lineHeight: 1.7, margin: "12px 0 0 0", paddingLeft: "42px" }}>
          {item.desc}
        </p>
        <div style={{
          overflow: "hidden", maxHeight: isOpen ? "300px" : "0px", opacity: isOpen ? 1 : 0,
          transition: "max-height 0.4s ease, opacity 0.3s ease 0.05s", paddingLeft: "42px",
        }}>
          <div style={{
            display: "flex", gap: "8px", flexWrap: "wrap",
            marginTop: "16px", paddingTop: "16px", borderTop: "1px dashed #D4D1C7",
          }}>
            {item.details.map((d, i) => (
              <span key={i} style={{
                fontSize: "13px", color: "#2D6A4F", fontWeight: 600,
                background: "rgba(45,106,79,0.06)", padding: "8px 14px",
                borderRadius: "8px", border: "1px solid rgba(45,106,79,0.1)",
              }}>{d}</span>
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
        role="button" tabIndex={0}
        onClick={() => setIsOpen(prev => !prev)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsOpen(prev => !prev); }}
        style={{
          background: "#fff", borderRadius: "14px", padding: "20px 24px",
          border: isOpen ? "1.5px solid #2D6A4F" : "1px solid #E8E5DC",
          cursor: "pointer", transition: "all 0.3s ease", userSelect: "none", outline: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <span style={{ fontSize: "15px", fontWeight: 600, color: "#1B1B18", lineHeight: 1.5 }}>{item.q}</span>
          <span style={{
            fontSize: "18px", color: isOpen ? "#2D6A4F" : "#B0B8B2",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease", flexShrink: 0,
          }}>▾</span>
        </div>
        <div style={{
          overflow: "hidden", maxHeight: isOpen ? "200px" : "0px", opacity: isOpen ? 1 : 0,
          transition: "max-height 0.4s ease, opacity 0.3s ease 0.05s",
        }}>
          <p style={{
            fontSize: "14px", color: "#5A6A5E", lineHeight: 1.7,
            margin: "12px 0 0 0", paddingTop: "12px", borderTop: "1px dashed #E8E5DC",
          }}>{item.a}</p>
        </div>
      </div>
    </FadeIn>
  );
}

function ProductCard({ prod, onWaitlist }) {
  const [open, setOpen] = useState(false);
  const isSoldOut = prod.status === "soldout";
  const statusLabel = isSoldOut ? "SOLD OUT" : "COMING SOON";
  const statusBg = isSoldOut ? "#D32F2F" : "#E67E22";
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: "#FAFAF7", borderRadius: "14px", padding: "20px",
        border: "1px solid #E8E5DC", cursor: "pointer",
        transition: "box-shadow 0.3s ease", position: "relative",
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 24px rgba(27,67,50,0.1)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{
        position: "absolute", top: "12px", right: "12px",
        background: statusBg, color: "#fff",
        fontSize: "9px", fontWeight: 800, padding: "3px 8px",
        borderRadius: "4px", letterSpacing: "0.1em",
      }}>{statusLabel}</div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <div style={{ fontSize: "28px", flexShrink: 0, marginTop: "2px" }}>{prod.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#1B1B18", marginBottom: "4px", paddingRight: "80px" }}>{prod.name}</div>
          <div style={{ fontSize: "12px", color: "#6B7B6E", marginBottom: "6px", lineHeight: 1.5 }}>{prod.tagline}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "15px", fontWeight: 800, color: "#1B4332" }}>{prod.price}</span>
            <span style={{ fontSize: "11px", color: "#8A9A8E" }}>{prod.priceYear}</span>
          </div>
          <div style={{ fontSize: "11px", color: "#8A9A8E", marginTop: "4px" }}>
            추천: {prod.target}
          </div>
        </div>
      </div>

      {open && (
        <div style={{
          marginTop: "14px", paddingTop: "14px",
          borderTop: "1px solid #E8E5DC",
        }}>
          <p style={{ fontSize: "13px", color: "#5A6A5E", lineHeight: 1.7, margin: "0 0 12px" }}>
            {prod.desc}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onWaitlist(); }}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "8px",
              background: "rgba(45,106,79,0.06)", border: "1px solid rgba(45,106,79,0.15)",
              fontSize: "12px", color: "#2D6A4F", fontWeight: 600,
              cursor: "pointer", transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #1B4332, #2D6A4F)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(45,106,79,0.06)";
              e.currentTarget.style.color = "#2D6A4F";
            }}
          >
            📋 {isSoldOut ? "대기자 명단 등록 → 런칭 시 가장 먼저 알림" : "런칭 시 가장 먼저 알림 받기"}
          </button>
        </div>
      )}
    </div>
  );
}

function TierCard({ tier, index, onCTAClick }) {
  const [hovered, setHovered] = useState(false);
  const isHL = tier.highlight;
  const handleCTA = useCallback(() => onCTAClick(tier.id), [tier.id, onCTAClick]);

  return (
    <FadeIn delay={index * 0.1}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: isHL ? "linear-gradient(165deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)" : "#FAFAF7",
          borderRadius: "20px", padding: isHL ? "3px" : "0",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          transition: "transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease",
          boxShadow: hovered ? "0 20px 60px rgba(27,67,50,0.18)" : "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{
          background: isHL ? "linear-gradient(180deg, #0D1F17 0%, #132E1F 100%)" : "#FAFAF7",
          borderRadius: isHL ? "18px" : "20px", padding: "32px 28px", minHeight: "540px",
          display: "flex", flexDirection: "column",
          border: isHL ? "none" : "1px solid #E8E5DC", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "20px", right: "20px",
            background: tier.badgeColor, color: "#fff",
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
            padding: "5px 10px", borderRadius: "6px",
          }}>{tier.badge}</div>

          <div style={{ fontSize: "36px", marginBottom: "12px" }}>{tier.emoji}</div>

          <h3 style={{
            fontFamily: "'Noto Serif KR', serif", fontSize: "22px", fontWeight: 700,
            color: isHL ? "#E8E5DC" : "#1B1B18", margin: "0 0 4px 0", lineHeight: 1.3,
          }}>{tier.name}</h3>
          {tier.grade && (
            <p style={{
              fontSize: "11px", color: isHL ? "#B7E4C7" : "#2D6A4F",
              margin: "0 0 4px 0", fontWeight: 600, opacity: 0.8,
            }}>등급: {tier.grade}</p>
          )}
          <p style={{
            fontSize: "13px", color: isHL ? "#95D5B2" : "#6B7B6E",
            margin: "0 0 20px 0", fontWeight: 500,
          }}>{tier.subtitle}</p>

          <div style={{ marginBottom: "16px" }}>
            <span style={{
              fontSize: "34px", fontWeight: 800,
              color: isHL ? "#B7E4C7" : "#1B4332", letterSpacing: "-0.02em",
            }}>{tier.price}</span>
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

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
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

          {tier.bonuses && tier.bonuses.length > 0 && (
            <div style={{
              marginTop: "14px", paddingTop: "14px",
              borderTop: `1px dashed ${isHL ? "rgba(149,213,178,0.3)" : "#E8E5DC"}`,
            }}>
              <div style={{
                fontSize: "11px", fontWeight: 700, color: isHL ? "#95D5B2" : "#2D6A4F",
                marginBottom: "8px", letterSpacing: "0.05em",
              }}>🎁 멤버 전용 혜택</div>
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
            onClick={handleCTA}
            style={{
              marginTop: "24px", width: "100%", padding: "14px 0", borderRadius: "12px",
              border: isHL ? "none" : "1.5px solid #2D6A4F",
              background: isHL ? "linear-gradient(135deg, #40916C, #52B788)" : "transparent",
              color: isHL ? "#fff" : "#2D6A4F",
              fontSize: "15px", fontWeight: 700, cursor: "pointer",
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
              가장 느린 달팽이의 지속 가능한 수익 구조를 함께 만들어가는 멤버십
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

      {/* ══════ RUNNING SYSTEMS ══════ */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#2D6A4F",
              background: "rgba(45,106,79,0.08)", padding: "6px 14px",
              borderRadius: "100px", marginBottom: "16px", letterSpacing: "0.05em",
            }}>다른 AI 스터디와의 결정적 차이</div>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "30px", fontWeight: 700, marginBottom: "12px",
            }}>지금 실제로 돌아가고 있는 시스템</h2>
            <p style={{ color: "#6B7B6E", fontSize: "15px", marginBottom: "48px", lineHeight: 1.7 }}>
              이론이 아닙니다. 아래 시스템들이 지금 이 순간에도<br />
              120평 공방과 60평 펜션에서 <strong style={{ color: "#1B4332" }}>24시간 자동으로 작동</strong>하고 있습니다.
            </p>
          </FadeIn>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px",
          }}>
            {RUNNING_SYSTEMS.map((sys, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div style={{
                  background: "#FAFAF7", borderRadius: "14px", padding: "20px",
                  border: "1px solid #E8E5DC", display: "flex", alignItems: "flex-start", gap: "14px",
                }}>
                  <div style={{
                    fontSize: "28px", flexShrink: 0, width: "48px", height: "48px", borderRadius: "12px",
                    background: "rgba(45,106,79,0.06)", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{sys.icon}</div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#1B1B18", marginBottom: "4px" }}>{sys.name}</div>
                    <div style={{ fontSize: "13px", color: "#6B7B6E", lineHeight: 1.5 }}>{sys.desc}</div>
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
                이 모든 시스템을 직접 보고, 배우고, 만들 수 있습니다. 또는 통째로 맡길 수도 있습니다.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 5-STEP FUNNEL ══════ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#2D6A4F",
              background: "rgba(45,106,79,0.08)", padding: "6px 14px",
              borderRadius: "100px", marginBottom: "16px", letterSpacing: "0.05em",
            }}>6단계의 차별화된 성장 스터디</div>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "30px", fontWeight: 700,
              textAlign: "center", marginBottom: "12px",
            }}>느리지만 가장 트렌디하게</h2>
            <p style={{ textAlign: "center", color: "#6B7B6E", fontSize: "15px", marginBottom: "48px", lineHeight: 1.7 }}>
              지속 가능한 수익 구조를 함께 만들어갑니다.<br />
              부담 없이 무료 자료부터 시작하세요.
            </p>
          </FadeIn>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {FUNNEL_STEPS.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ position: "relative" }}>
                  {/* 연결선 */}
                  {i < FUNNEL_STEPS.length - 1 && (
                    <div style={{
                      position: "absolute", left: "31px", top: "80px", bottom: "-10px",
                      width: "2px", background: "linear-gradient(180deg, " + step.color + ", " + FUNNEL_STEPS[i + 1].color + ")",
                      zIndex: 0,
                    }} />
                  )}

                  <div style={{
                    display: "flex", gap: "20px", padding: "20px 0",
                    position: "relative", zIndex: 1,
                  }}>
                    {/* 스텝 번호 + 아이콘 */}
                    <div style={{ flexShrink: 0, textAlign: "center" }}>
                      <div style={{
                        width: "64px", height: "64px", borderRadius: "16px", background: step.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "28px", boxShadow: "0 4px 16px rgba(27,67,50,0.15)",
                      }}>{step.emoji}</div>
                      <div style={{
                        fontSize: "10px", fontWeight: 800, color: step.color,
                        marginTop: "6px", letterSpacing: "0.05em",
                      }}>{step.step}</div>
                    </div>

                    {/* 내용 */}
                    <div style={{ flex: 1, paddingTop: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                        <span style={{ fontSize: "18px", fontWeight: 700, color: "#1B1B18" }}>{step.label}</span>
                        <span style={{
                          fontSize: "12px", fontWeight: 700, color: "#fff", background: step.color,
                          padding: "3px 12px", borderRadius: "100px",
                        }}>{step.price}</span>
                      </div>
                      <p style={{ fontSize: "14px", color: "#5A6A5E", margin: "0 0 6px", lineHeight: 1.6 }}>{step.sub}</p>
                      <span style={{
                        fontSize: "12px", color: "#2D6A4F", fontWeight: 600,
                        background: "rgba(45,106,79,0.06)", padding: "4px 12px",
                        borderRadius: "6px", display: "inline-block",
                      }}>{step.detail}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.6}>
            <div style={{
              marginTop: "32px", textAlign: "center",
              background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
              borderRadius: "16px", padding: "28px 24px",
            }}>
              <p style={{ fontSize: "15px", color: "#B7E4C7", margin: "0 0 4px", lineHeight: 1.7 }}>
                어떤 단계���서 시작하든, 시스템이 ��음 단계를 자연스럽게 안내합니다.
              </p>
              <p style={{ fontSize: "13px", color: "#6B9E82", margin: 0 }}>
                대부분의 분들은 무료 자료 → 템플릿 구매 → 멤버십 순으로 시작���고 있습니다.
              </p>
            </div>
          </FadeIn>
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
            }}>이런 걸 직접 만들 수 있어요</div>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "30px", fontWeight: 700, marginBottom: "12px",
            }}>현장에서 만들고, 가져간다</h2>
            <p style={{ color: "#6B7B6E", fontSize: "15px", marginBottom: "40px", lineHeight: 1.7 }}>
              프로 멤버십과 8주 부트캠프에서 배우고 직접 만드는 핵심 주제입니다.<br />
              이론과 실습을 병행하며, 돌아갈 때는 완성된 결과물을 손에 들고 갑니다.
              <br /><br />
              <span style={{ color: "#1B4332", fontWeight: 700, fontSize: "14px" }}>⏱️ 과정별 6시간 · 이론 + 실습 병행 · 당일 결과물 완성</span>
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

      {/* ══════ FREE RESOURCES ══════ */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(180deg, #F5F4EF 0%, #EBE9E1 100%)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#2D6A4F",
              background: "rgba(45,106,79,0.08)", padding: "6px 14px",
              borderRadius: "100px", marginBottom: "16px", letterSpacing: "0.05em",
            }}>STEP 1 — 무료로 시작하기</div>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "30px", fontWeight: 700, marginBottom: "12px",
            }}>사장님, 이것만 자동화하면 하루 3시간 벌어요</h2>
            <p style={{ color: "#6B7B6E", fontSize: "15px", marginBottom: "40px", lineHeight: 1.7 }}>
              이메일 하나면 충분합니다. 구독 즉시 아래 자료 3종을 무료로 보내드립니다.
            </p>
          </FadeIn>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {FREE_RESOURCES.map((res, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{
                  background: "#fff", borderRadius: "14px", padding: "20px 24px",
                  border: "1px solid #E8E5DC",
                  display: "flex", alignItems: "center", gap: "16px",
                }}>
                  <div style={{
                    fontSize: "28px", flexShrink: 0, width: "52px", height: "52px",
                    borderRadius: "14px", background: "rgba(45,106,79,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{res.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "16px", fontWeight: 700, color: "#1B1B18" }}>{res.name}</span>
                      <span style={{
                        fontSize: "10px", fontWeight: 700, color: "#fff", background: "#2D6A4F",
                        padding: "2px 8px", borderRadius: "100px",
                      }}>무료</span>
                    </div>
                    <div style={{ fontSize: "13px", color: "#6B7B6E" }}>{res.desc}</div>
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: 600, color: "#8A9A8E",
                    background: "#F5F4EF", padding: "4px 10px", borderRadius: "6px", flexShrink: 0,
                  }}>{res.type}</span>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <div style={{ textAlign: "center", marginTop: "28px" }}>
              <button
                onClick={() => handleCTAClick("letter")}
                style={{
                  padding: "16px 40px", borderRadius: "14px",
                  background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
                  color: "#fff", fontSize: "16px", fontWeight: 700,
                  border: "none", cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(27,67,50,0.2)",
                }}
              >🐌 무료 구독하고 자료 받기</button>
            </div>
          </FadeIn>
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
            }}>STEP 3~5 — 함께 성장하기</h2>
            <p style={{ textAlign: "center", color: "#6B7B6E", fontSize: "15px", marginBottom: "16px" }}>
              혼자보다 함께일 때 더 빠릅니다. 나에게 맞는 멤버십을 선택하세요.
            </p>
            <p style={{ textAlign: "center", fontSize: "13px", color: "#8A9A8E", marginBottom: "52px" }}>
              800명이 함께하고 있습니다 · 달팽이처럼 천천히, 하지만 확실하게
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
                    transition: "box-shadow 0.3s ease", marginBottom: "20px",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 12px 40px rgba(27,67,50,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                >
                  <div style={{
                    fontSize: "40px", flexShrink: 0, width: "72px", height: "72px", borderRadius: "18px",
                    background: "rgba(74,124,89,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{letterTier.emoji}</div>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: "11px", fontWeight: 800, color: "#fff",
                        background: letterTier.badgeColor, padding: "3px 10px",
                        borderRadius: "6px", letterSpacing: "0.05em",
                      }}>{letterTier.badge}</span>
                      <h3 style={{
                        fontFamily: "'Noto Serif KR', serif",
                        fontSize: "22px", fontWeight: 700, color: "#1B1B18", margin: 0,
                      }}>{letterTier.name}</h3>
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
                        }}>✓ {f}</span>
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
                      color: "#fff", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer",
                    }}>{letterTier.cta}</button>
                  </div>
                </div>
              </FadeIn>
            );
          })()}

          {/* Lv.2~4 — 3열 그리드 */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px", alignItems: "start",
          }}>
            {TIERS.filter(t => t.id !== "letter").map((tier, i) => (
              <TierCard key={tier.id} tier={tier} index={i} onCTAClick={handleCTAClick} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ 8주 부트캠프 ══════ */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#2D6A4F",
              background: "rgba(45,106,79,0.08)", padding: "6px 14px",
              borderRadius: "100px", marginBottom: "16px", letterSpacing: "0.05em",
            }}>퍼널구축 아카데미</div>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "30px", fontWeight: 700, marginBottom: "12px",
            }}>{BOOTCAMP.emoji} 8주 만에 내 사업의 자동화 퍼널을 완성합니다</h2>
            <p style={{ color: "#6B7B6E", fontSize: "15px", marginBottom: "8px", lineHeight: 1.7 }}>
              기술이 아니라 "매출이 나는 구조"를 만드는 과정.
            </p>
            <p style={{ color: "#5A6A5E", fontSize: "14px", marginBottom: "12px", lineHeight: 1.8 }}>
              n8n도, Supabase도, 코딩도 몰라도 됩니다.<br />
              "내 가게에 손님이 알아서 오고, 문자가 알아서 나가고, 리뷰가 알아서 쌓이는 구조"<br />
              그걸 8주 만에 직접 만듭니다.
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#1B4332", color: "#B7E4C7", padding: "8px 16px",
              borderRadius: "8px", fontSize: "13px", fontWeight: 700, marginBottom: "32px",
            }}>
              🔥 {BOOTCAMP.nextTerm}
            </div>
          </FadeIn>

          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {/* 커리큘럼 */}
            <div style={{ flex: "1 1 400px" }}>
              <FadeIn delay={0.1}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "#1B4332" }}>
                  📋 8주 커리큘럼
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {BOOTCAMP.curriculum.map((item, i) => (
                    <div key={i} style={{
                      display: "flex", gap: "12px", padding: "12px 16px",
                      background: i % 2 === 0 ? "#FAFAF7" : "#fff",
                      borderRadius: "10px", border: "1px solid #E8E5DC",
                    }}>
                      <span style={{
                        fontSize: "11px", fontWeight: 800, color: "#2D6A4F",
                        background: "rgba(45,106,79,0.08)", padding: "4px 8px",
                        borderRadius: "6px", flexShrink: 0, alignSelf: "flex-start",
                      }}>{item.week}</span>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#1B1B18" }}>{item.title}</div>
                        <div style={{ fontSize: "12px", color: "#6B7B6E", marginTop: "2px" }}>{item.task}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* 가격 + 혜택 */}
            <div style={{ flex: "1 1 280px" }}>
              <FadeIn delay={0.2}>
                <div style={{
                  background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
                  borderRadius: "16px", padding: "28px", textAlign: "center", marginBottom: "20px",
                }}>
                  <div style={{ fontSize: "12px", color: "#95D5B2", marginBottom: "8px", letterSpacing: "0.1em" }}>
                    {BOOTCAMP.schedule}
                  </div>
                  <div style={{ fontSize: "36px", fontWeight: 800, color: "#fff", marginBottom: "4px" }}>
                    {BOOTCAMP.price}
                  </div>
                  <div style={{ fontSize: "13px", color: "#95D5B2" }}>{BOOTCAMP.priceNote}</div>

                  <button
                    onClick={() => handleCTAClick("bootcamp")}
                    style={{
                      marginTop: "20px", width: "100%", padding: "14px",
                      borderRadius: "12px", border: "none",
                      background: "linear-gradient(135deg, #40916C, #52B788)",
                      color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer",
                    }}
                  >🎓 부트캠프 신청하기</button>
                </div>

                <div style={{
                  background: "#FAFAF7", borderRadius: "12px", padding: "20px",
                  border: "1px solid #E8E5DC",
                }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#2D6A4F", marginBottom: "12px" }}>
                    🎁 부트캠프 혜택
                  </div>
                  {BOOTCAMP.benefits.map((b, i) => (
                    <div key={i} style={{
                      fontSize: "13px", color: "#3A4A3E", display: "flex",
                      alignItems: "flex-start", gap: "8px", lineHeight: 1.6,
                    }}>
                      <span style={{ color: "#4A7C59", flexShrink: 0 }}>✓</span> {b}
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ 구축 대행 (DFY) ══════ */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(180deg, #F5F4EF 0%, #EBE9E1 100%)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#2D6A4F",
              background: "rgba(45,106,79,0.08)", padding: "6px 14px",
              borderRadius: "100px", marginBottom: "16px", letterSpacing: "0.05em",
            }}>STEP 5 — 통째로 맡기기</div>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "30px", fontWeight: 700, marginBottom: "12px",
            }}>🔧 사장님은 사업에 집중하세요. 시스템은 저희가 만듭니다.</h2>
            <p style={{ color: "#6B7B6E", fontSize: "15px", marginBottom: "12px", lineHeight: 1.7 }}>
              펜션과 CNC 공방을 직접 운영하며 검증한 자동화 시스템을 여러분의 사업에 맞춤 구축해드립니다.<br />
              멤버십 회원은 <strong style={{ color: "#1B4332" }}>15~20% 할인</strong>이 적용됩니다.
            </p>
            <p style={{ fontSize: "13px", color: "#8A9A8E", marginBottom: "40px" }}>
              무료 상담 (30분) → 계약 + 착수금 50% → 구축 (2~4주) → 인수인계 교육 → 잔금 50% → 1개월 무상 AS
            </p>
          </FadeIn>

          {/* 3종 패키지 */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "20px", alignItems: "start",
          }}>
            {DFY_PACKAGES.map((pkg, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div style={{
                  position: "relative",
                  background: pkg.popular ? "linear-gradient(165deg, #1B4332, #2D6A4F, #40916C)" : "#FAFAF7",
                  borderRadius: "20px", padding: pkg.popular ? "3px" : "0",
                }}>
                  <div style={{
                    background: pkg.popular ? "linear-gradient(180deg, #0D1F17, #132E1F)" : "#FAFAF7",
                    borderRadius: pkg.popular ? "18px" : "20px",
                    padding: "28px 24px",
                    border: pkg.popular ? "none" : "1px solid #E8E5DC",
                    position: "relative",
                  }}>
                    {pkg.popular && (
                      <div style={{
                        position: "absolute", top: "16px", right: "16px",
                        background: "#52B788", color: "#fff",
                        fontSize: "10px", fontWeight: 700, padding: "4px 10px",
                        borderRadius: "6px", letterSpacing: "0.05em",
                      }}>인기</div>
                    )}
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>{pkg.emoji}</div>
                    <h3 style={{
                      fontFamily: "'Noto Serif KR', serif", fontSize: "20px", fontWeight: 700,
                      color: pkg.popular ? "#E8E5DC" : "#1B1B18", margin: "0 0 4px",
                    }}>{pkg.name}</h3>
                    <p style={{
                      fontSize: "11px", color: pkg.popular ? "#95D5B2" : "#8A9A8E",
                      margin: "0 0 8px", fontWeight: 600,
                    }}>{pkg.period} · {pkg.target}</p>
                    <p style={{
                      fontSize: "13px", color: pkg.popular ? "#B7E4C7" : "#6B7B6E",
                      margin: "0 0 16px", lineHeight: 1.5, fontStyle: "italic",
                    }}>"{pkg.desc}"</p>

                    <div style={{ marginBottom: "16px" }}>
                      <span style={{
                        fontSize: "30px", fontWeight: 800,
                        color: pkg.popular ? "#B7E4C7" : "#1B4332",
                      }}>{pkg.price}</span>
                    </div>

                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: "7px" }}>
                      {pkg.includes.map((item, j) => (
                        <li key={j} style={{
                          fontSize: "12.5px", color: pkg.popular ? "#D8F3DC" : "#3A4A3E",
                          display: "flex", alignItems: "flex-start", gap: "8px", lineHeight: 1.5,
                        }}>
                          <span style={{ color: pkg.popular ? "#95D5B2" : "#4A7C59", flexShrink: 0, marginTop: "2px" }}>✓</span> {item}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleCTAClick("dfy")}
                      style={{
                        width: "100%", padding: "14px", borderRadius: "12px",
                        border: pkg.popular ? "none" : "1.5px solid #2D6A4F",
                        background: pkg.popular ? "linear-gradient(135deg, #40916C, #52B788)" : "transparent",
                        color: pkg.popular ? "#fff" : "#2D6A4F",
                        fontSize: "15px", fontWeight: 700, cursor: "pointer",
                      }}
                    >무료 상담 신청</button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* 추가 옵션 (애드온) */}
          <FadeIn delay={0.4}>
            <div style={{
              marginTop: "24px", background: "#fff", borderRadius: "14px",
              padding: "20px 24px", border: "1px solid #E8E5DC",
            }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#2D6A4F", marginBottom: "12px" }}>
                🔌 추가 옵션 (어떤 패키지에든 추가 가능)
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {DFY_ADDONS.map((addon, i) => (
                  <span key={i} style={{
                    fontSize: "12px", color: "#3A4A3E", fontWeight: 600,
                    background: "#F5F4EF", padding: "6px 14px",
                    borderRadius: "8px", border: "1px solid #E8E5DC",
                  }}>
                    {addon.name} <span style={{ color: "#2D6A4F", fontWeight: 700 }}>{addon.price}</span>
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* 유지보수 3종 */}
          <FadeIn delay={0.5}>
            <div style={{
              marginTop: "16px", background: "#fff", borderRadius: "14px",
              padding: "20px 24px", border: "1px solid #E8E5DC",
            }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#2D6A4F", marginBottom: "14px" }}>
                🛡️ 납품 후 유지보수 (선택)
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {MAINTENANCE_PLANS.map((plan, i) => (
                  <div key={i} style={{
                    flex: "1 1 200px", background: "#FAFAF7", borderRadius: "10px",
                    padding: "14px 16px", border: "1px solid #E8E5DC",
                  }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#1B4332", marginBottom: "4px" }}>
                      {plan.name}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "#2D6A4F", marginBottom: "6px" }}>
                      {plan.price}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6B7B6E", lineHeight: 1.5 }}>
                      {plan.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ 바로 구매 서비스 ══════ */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#2D6A4F",
              background: "rgba(45,106,79,0.08)", padding: "6px 14px",
              borderRadius: "100px", marginBottom: "16px", letterSpacing: "0.05em",
            }}>멤버십 구독 없이 바로 시작</div>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "30px", fontWeight: 700, marginBottom: "12px",
            }}>📦 바로 구매 서비스</h2>
            <p style={{ color: "#6B7B6E", fontSize: "15px", marginBottom: "12px", lineHeight: 1.7 }}>
              멤버십 구독 없이도 바로 활용할 수 있습니다.<br />
              소상공인 사장님이 진짜 필요한 시스템을 만들어, 저렴한 연 구독으로 제공합니다.
            </p>
            <p style={{ color: "#8A9A8E", fontSize: "13px", marginBottom: "12px", fontStyle: "italic" }}>
              "수요 없는 공급은 최소화하려고요. 수요 있는 공급자가 되길 바래봅니다."
            </p>
            <div style={{
              background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
              borderRadius: "12px", padding: "16px 20px", marginBottom: "40px",
              display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap",
            }}>
              <span style={{ fontSize: "20px" }}>🚀</span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#B7E4C7" }}>
                  SOLD OUT · COMING SOON — 대기자 명단 등록 중
                </div>
                <div style={{ fontSize: "12px", color: "#95D5B2", marginTop: "2px" }}>
                  런칭 시 가장 먼저 알림 드립니다. 아래에서 관심 상품을 확인하세요.
                </div>
              </div>
            </div>
          </FadeIn>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px",
          }}>
            {DIGITAL_PRODUCTS.map((prod, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <ProductCard prod={prod} onWaitlist={() => setActiveModal("waitlist")} />
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <button
                onClick={() => setActiveModal("waitlist")}
                style={{
                  padding: "16px 40px", borderRadius: "14px",
                  background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
                  color: "#fff", fontSize: "15px", fontWeight: 700,
                  border: "none", cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(27,67,50,0.2)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #0D1F17, #1B4332)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(27,67,50,0.35)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #1B4332, #2D6A4F)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(27,67,50,0.2)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >📋 대기자 명단 등록하기</button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════ MEMBER PERKS ══════ */}
      <section style={{ padding: "80px 24px", background: "#1B4332" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{
              fontFamily: "'Noto Serif KR', serif", fontSize: "28px", fontWeight: 700,
              textAlign: "center", marginBottom: "12px", color: "#E8E5DC",
            }}>안 하면 손해 — 멤버 전용 혜택</h2>
            <p style={{ textAlign: "center", color: "#95D5B2", fontSize: "15px", marginBottom: "48px" }}>
              멤버십 요금 이상의 가치를 돌려받습니다
            </p>
          </FadeIn>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px",
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
                        background: "rgba(149,213,178,0.15)", padding: "2px 8px", borderRadius: "100px",
                      }}>{perk.tier}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: "13px", color: "#95D5B2", margin: 0, lineHeight: 1.5 }}>{perk.desc}</p>
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
            }}>한눈에 비교</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "700px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #1B4332" }}>
                    {["", "📬 Lv.1", "💻 Lv.2", "🔧 Lv.3", "🚀 Lv.4"].map((h, i) => (
                      <th key={i} style={{
                        padding: "12px 8px", textAlign: i === 0 ? "left" : "center",
                        fontWeight: 700, color: "#1B4332", fontSize: "13px",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["가격", "무료", "₩29,900/월", "₩199,000/월", "₩990,000/월"],
                    ["빈도", "주 2회", "주 1회 라이브", "월 1회 오프 + 월 2회 코칭", "주 1회 1:1 코칭"],
                    ["형태", "뉴스레터", "온라인 라이브", "소그룹 코칭 + 오프라인", "1:1 밀착 코칭"],
                    ["AI 트렌드 뉴스", "✓", "✓", "✓", "✓"],
                    ["라이브 시연 + 녹화본", "—", "✓", "✓", "✓"],
                    ["커뮤니티 + 템플릿", "—", "✓", "✓", "✓"],
                    ["소그룹 코칭 (5명)", "—", "—", "✓", "✓"],
                    ["오프라인 워크샵", "—", "—", "✓", "✓"],
                    ["1:1 화상 코칭", "—", "—", "—", "✓"],
                    ["전용 실시간 QA", "—", "—", "—", "✓"],
                    ["구축 대행 할인", "—", "—", "15%", "20%"],
                    ["펜션·공방 혜택", "—", "—", "할인 이용", "무료 이용"],
                    ["수익 분배 파트너십", "—", "—", "—", "최대 40%"],
                    ["정원", "무제한", "800명", "50명", "20명"],
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
            }}>자주 묻는 질문</h2>
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
            }}>운영자 · 임솔 (Sol)</h2>
            <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#5A6A5E", maxWidth: "560px", margin: "0 auto 28px" }}>
              120평 CNC 공방과 60평 독채 펜션을 직접 운영하면서,<br />
              n8n · Supabase · Claude API · React를 활용해<br />
              <strong style={{ color: "#1B4332" }}>예약부터 마케팅까지 전 과정을 AI로 자동화</strong>하고 있습니다.<br /><br />
              7년간의 호스팅 경험과 에어비앤비 평점 5.0,<br />
              서울이 아닌 완주에서 만들어낸 자동화 성공 사례.<br />
              현재진행형 실험의 모든 것을 공유합니다.
            </p>

            <p style={{
              fontSize: "14px", color: "#2D6A4F", fontWeight: 600, fontStyle: "italic",
              margin: "0 auto 28px", maxWidth: "480px", lineHeight: 1.7,
            }}>
              "직접 배우고 싶다면 멤버십을,<br />
              바로 결과물이 필요하다면 구축 대행을 선택하세요."
            </p>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:01085319531" style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "#FAFAF7", padding: "10px 20px", borderRadius: "10px",
                fontSize: "14px", fontWeight: 500, color: "#3A4A3E",
                border: "1px solid #E8E5DC", textDecoration: "none",
              }}>📞 010-8531-9531</a>
              <a href="https://open.kakao.com/o/sool9241" target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "#FAFAF7", padding: "10px 20px", borderRadius: "10px",
                fontSize: "14px", fontWeight: 500, color: "#3A4A3E",
                border: "1px solid #E8E5DC", textDecoration: "none",
              }}>💬 카카오톡 sool9241</a>
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
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setActiveModal("letter")} style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "18px 40px", background: "#fff", color: "#1B4332",
              borderRadius: "14px", fontSize: "17px", fontWeight: 800,
              border: "none", cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}>🐌 달팽이레터 무료 구독하기</button>
            <button onClick={() => handleCTAClick("dfy")} style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "18px 40px", background: "transparent", color: "#fff",
              borderRadius: "14px", fontSize: "17px", fontWeight: 700,
              border: "1.5px solid rgba(255,255,255,0.4)", cursor: "pointer",
            }}>🔧 구축 대행 무료 상담</button>
          </div>
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
      <NewsletterSignupModal
        isOpen={activeModal === "waitlist"}
        onClose={() => setActiveModal(null)}
        waitlistMode
      />
      <MembershipApplyModal
        isOpen={["online", "pro", "partner", "bootcamp", "dfy"].includes(activeModal)}
        onClose={() => setActiveModal(null)}
        tierId={activeModal || "online"}
      />
    </div>
  );
}
