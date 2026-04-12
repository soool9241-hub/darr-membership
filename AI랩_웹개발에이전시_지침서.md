# AI랩 — 웹개발 실행 에이전시 지침서

> **문서 목적**: AI 에이전트 기반 웹개발 실행사 "AI랩"의 조직·역할·워크플로우·툴스택 표준 정의서.
> **핵심 전제**: 사람 팀이 아닌 **Claude 기반 AI 에이전트 20종**이 각자 역할을 맡아 프로젝트를 실행한다. 사람(오퍼레이터)은 오케스트레이션과 고객 접점만 담당.
> **최종 업데이트**: 2026-04-12

---

## 0. 에이전시 정체성

### 0.1 한 줄 정의
> "20명의 AI 전문가가 1팀으로 움직이는 웹개발 실행 에이전시."

### 0.2 포지셔닝
- **실행사(執行社)** — 기획·설계·개발·배포·운영까지 "완성품"만 납품. 컨설팅/리포트 납품 금지.
- **바이브 코딩 기반** — AI와 대화로 만드는 방식. 사람 개발자 풀을 유지하지 않는다.
- **달팽이 생태계 연결** — 달팽이레터·멤버십·아카데미의 DFY 파이프라인을 실행하는 엔진.

### 0.3 차별점
1. **속도**: 기획→런칭 2~4주 (사람 팀은 2~3개월)
2. **원가**: 인건비 없음 → 마진율 60~80%
3. **확장성**: 동시 10~20 프로젝트 병렬 가능
4. **재현성**: 에이전트 프롬프트가 자산. 사람처럼 이직·번아웃 없음.

### 0.4 운영 원칙
- **사람은 감독, 에이전트는 실행**. 오퍼레이터는 품질 게이트와 고객 접점만.
- **모든 산출물은 버전관리**. 에이전트 출력도 git/파일에 기록.
- **에이전트 = 프롬프트 + 툴 + 권한**. 이 3가지 정의가 곧 채용서다.

---

## 1. 기술 스택 표준 (고정)

에이전트들이 다룰 기술을 **의도적으로 좁게 고정**한다. 선택지를 줄여야 품질과 속도가 올라간다.

| 레이어 | 고정 스택 | 대체 금지 |
|---|---|---|
| 프론트엔드 | React 19 + Vite (JS, TS 선택) | Next.js는 케이스별 허용 |
| 스타일 | 인라인 / Tailwind 택1 | CSS-in-JS 금지 |
| 백엔드/DB | Supabase (Postgres + Auth + Storage) | 자체 서버 금지 |
| 호스팅 | Vercel | AWS 직접 배포 금지 |
| 자동화 | n8n + Claude API + Solapi | Zapier 금지 |
| 결제 | 토스페이먼츠 / Stripe | |
| 폼/CRM | Supabase 네이티브 | |
| 분석 | Vercel Analytics + Umami | GA4 선택 |
| 저장소 | GitHub | |
| 프로젝트 관리 | Linear (또는 Notion) | |
| 커뮤니케이션 | Slack + 이메일 | |

**왜 고정하는가**: 에이전트 각 역할의 프롬프트가 스택에 맞춰 최적화되어 있기 때문. 스택을 흔들면 20명 전체 재훈련 필요.

---

## 2. 에이전트 조직도 (20명 로스터)

```
                    ┌──────────────────────┐
                    │  [00] Orchestrator   │  ← 사람 오퍼레이터가 직접 지휘
                    │  (지휘자 / PM 수석)    │
                    └──────────┬───────────┘
                               │
     ┌──────────────┬──────────┴──────────┬──────────────┐
     ▼              ▼                     ▼              ▼
  영업/기획         설계/빌드             운영/품질       운영지원
  (5명)            (8명)                 (4명)          (3명)
```

### 2.1 전체 명단

| # | 에이전트 | 분류 | 주 역할 | 주요 툴 |
|---|---|---|---|---|
| 00 | **Orchestrator** | 지휘 | 프로젝트 라우팅·우선순위·승인 게이트 | All |
| 01 | **Discovery Agent** | 기획 | 고객 인터뷰 요약, 요구사항 문서화 | Read, Write, Web |
| 02 | **Proposal Agent** | 영업 | 제안서/견적서 작성 | Write, Read |
| 03 | **Research Agent** | 영업 | 경쟁사/시장 조사, 레퍼런스 수집 | WebSearch, WebFetch |
| 04 | **Brand/Copy Agent** | 기획 | 브랜드 톤 정의, 랜딩 카피 작성 | Write, Read |
| 05 | **Information Architect** | 설계 | 사이트맵·와이어프레임·사용자 플로우 | Write, Read |
| 06 | **UI Designer Agent** | 설계 | 디자인 시스템, 컬러/타이포/컴포넌트 | Write, Read |
| 07 | **Frontend Builder** | 개발 | React/Vite 구현, 인라인 스타일 | Edit, Write, Bash |
| 08 | **Backend/DB Agent** | 개발 | Supabase 스키마·RLS·마이그레이션 | Edit, Write, Bash |
| 09 | **Automation Agent** | 개발 | n8n 워크플로우, Solapi/Claude API 연결 | Write, Bash |
| 10 | **Integration Agent** | 개발 | 결제·지도·카톡·이메일 연동 | Edit, Bash |
| 11 | **Content Migration** | 개발 | 기존 사이트 데이터/이미지 이관 | Read, Write, Bash |
| 12 | **QA Agent** | 품질 | 체크리스트 50항목 검수, 버그 리포트 | Read, Bash |
| 13 | **Performance Agent** | 품질 | Lighthouse, 번들 사이즈, LCP 최적화 | Bash, Read |
| 14 | **Security/Audit Agent** | 품질 | RLS 검증, 시크릿 스캔, OWASP 체크 | Grep, Read, Bash |
| 15 | **SEO Agent** | 품질 | 메타·OG·sitemap·robots·schema.org | Edit, Write |
| 16 | **Deploy Agent** | 운영 | Vercel 배포, 도메인, 환경변수 | Bash |
| 17 | **Analytics Agent** | 운영 | 대시보드 구축, 주간 리포트 자동 발송 | Write, Bash |
| 18 | **Support/Maintenance** | 운영 | 버그 수정, 소규모 변경 요청 처리 | Edit, Bash |
| 19 | **Docs/Handover Agent** | 지원 | 인수인계서·매뉴얼·README 작성 | Write, Read |

---

## 3. 에이전트별 상세 정의

각 에이전트는 `subagent_type` + `system_prompt` + `allowed_tools` + `output_contract` 4가지로 정의된다.

### [00] Orchestrator
- **책임**: 프로젝트 킥오프 시 어떤 에이전트를 어떤 순서로 호출할지 결정. 각 단계 산출물 승인.
- **도구**: Task, Read, Write (모든 에이전트 호출 권한)
- **핸드오프 프로토콜**: 항상 `/projects/{client_id}/state.md`에 현재 상태 기록.
- **승인 게이트**: Discovery 승인 → 설계 승인 → 개발 착수 → QA 통과 → 런칭.

### [01] Discovery Agent
- **입력**: 고객과의 미팅 녹취·이메일·폼 답변
- **출력**: `discovery.md` (업종, 목표, 타겟, 경쟁사, 기능 요구사항, 예산, 일정)
- **시스템 프롬프트 요지**: "당신은 고객의 모호한 요구를 구조화된 요구사항 문서로 정리하는 비즈니스 애널리스트입니다. 빠진 정보는 추측하지 말고 질문 목록으로 남기세요."

### [02] Proposal Agent
- **입력**: `discovery.md` + 패키지 카탈로그
- **출력**: `proposal.md` + `estimate.md` (견적, 일정, 산출물 명세)
- **원칙**: 스타터/비즈니스/프리미엄 3단 중 택1 추천 + 근거 명시.

### [03] Research Agent
- **입력**: 업종/키워드
- **출력**: `research.md` (경쟁사 5~10개 분석, 레퍼런스 URL, 트렌드)
- **도구**: WebSearch, WebFetch (외부 리서치 필수)

### [04] Brand/Copy Agent
- **입력**: `discovery.md` + `research.md`
- **출력**: `brand.md` (톤, 슬로건, 섹션별 헤드라인, CTA 카피 3안)
- **원칙**: "~습니다" 존댓말 기본. 과장·허위 금지. 사장님 호칭.

### [05] Information Architect
- **입력**: `discovery.md` + `brand.md`
- **출력**: `sitemap.md` + `wireframe.md` (페이지 구조, 섹션 순서, 컴포넌트 트리)

### [06] UI Designer Agent
- **입력**: `wireframe.md` + 브랜드 자료
- **출력**: `design-system.md` (컬러 팔레트, 타이포, 간격, 컴포넌트 스타일 토큰)
- **원칙**: 인라인 스타일 토큰 테이블로 출력 → Frontend Builder가 바로 복붙 가능.

### [07] Frontend Builder
- **입력**: `wireframe.md` + `design-system.md` + `brand.md`
- **출력**: `src/` 전체 React 코드
- **표준**: React 19 + Vite, 컴포넌트 파일당 1개, FadeIn 애니메이션 기본.
- **금지**: 임의 라이브러리 추가 (package.json 수정은 Orchestrator 승인 필요).

### [08] Backend/DB Agent
- **입력**: 기능 요구사항
- **출력**: `supabase-schema.sql` + `migration-*.sql` + RLS 정책
- **표준**: 모든 테이블에 `created_at`, `id UUID`, RLS 활성화. anon insert 정책 명시.

### [09] Automation Agent
- **입력**: 자동화 시나리오 (예: "예약 → 문자 → D-1 알림 → 리뷰 요청")
- **출력**: n8n workflow JSON + 설치 가이드
- **연결**: Solapi(문자), Claude API(AI 응답), Supabase(DB).

### [10] Integration Agent
- **책임**: 결제(토스/Stripe), 네이버 지도, 카카오 비즈채널, Mailgun 등 외부 API 연동 코드 작성.

### [11] Content Migration Agent
- **책임**: 기존 워드프레스/카페24/티스토리 → 신규 사이트로 콘텐츠 이관. 이미지 최적화 포함.

### [12] QA Agent
- **입력**: 배포 URL + `qa-checklist.md`
- **출력**: `qa-report.md` (50항목 체크, 발견 버그 목록)
- **표준 체크리스트**: 모바일 반응형, 폼 검증, 404, 속도(LCP<2.5s), 접근성(alt, aria), 크로스브라우저.

### [13] Performance Agent
- **책임**: Lighthouse 90+ 달성, 번들 사이즈 분석, 이미지 최적화 제안.

### [14] Security/Audit Agent
- **책임**: `.env` 시크릿 유출 스캔, Supabase RLS 미적용 테이블 검출, XSS/SQL-i 취약점 패턴 검사.
- **금지**: 코드 자체 수정 권한 없음. 리포트만 작성 → Frontend/Backend가 수정.

### [15] SEO Agent
- **책임**: `index.html` 메타 태그, Open Graph, `sitemap.xml`, `robots.txt`, JSON-LD schema.

### [16] Deploy Agent
- **책임**: `vercel deploy --prod`, 도메인 연결, 환경변수 동기화, 배포 로그 확인.

### [17] Analytics Agent
- **책임**: Umami/Vercel Analytics 심기, 주간 지표 리포트 자동 발송 세팅.

### [18] Support/Maintenance Agent
- **책임**: 런칭 후 1개월 무상 AS 기간 내 수정 요청 처리. 작은 버그·카피 변경·이미지 교체.

### [19] Docs/Handover Agent
- **입력**: 전체 산출물
- **출력**: `handover.md` (관리자 로그인, 수정 방법, 문제 발생 시 연락처, 연결 서비스 목록)

---

## 4. 표준 프로젝트 워크플로우 (SOP)

한 프로젝트 = **7단계 · 2~4주**.

### Stage 1 — Discovery (1~2일)
`[01]` → `[03]` 병렬 실행 → Orchestrator 승인

### Stage 2 — Proposal (1일)
`[02]` → 고객 서명 → 계약금 50% 수금 → 착수

### Stage 3 — Design (3~5일)
`[04]` → `[05]` → `[06]` 순차 실행

### Stage 4 — Build (5~10일)
```
[07] Frontend ─┐
[08] Backend   ├─ 병렬
[09] Automation┘
       ↓
[10] Integration (순차, 의존성 있음)
[11] Migration (필요 시)
```

### Stage 5 — QA (2~3일)
`[12]` → `[13]` → `[14]` → `[15]` 순차 실행. 버그 발견 시 Stage 4로 되돌려보냄.

### Stage 6 — Launch (1일)
`[16]` 배포 → `[17]` 분석 심기 → `[19]` 인수인계서

### Stage 7 — Handover & AS (30일)
고객 인수인계 미팅 → 잔금 50% 수금 → `[18]`가 1개월 AS 대기

---

## 5. 핸드오프 프로토콜

에이전트 간 소통은 **파일 시스템**으로만 한다. 메모리 공유 금지.

### 5.1 프로젝트 디렉토리 규약
```
/projects/{client_slug}/
├── state.md              ← Orchestrator가 관리하는 현재 상태
├── 01-discovery.md
├── 02-proposal.md
├── 03-research.md
├── 04-brand.md
├── 05-sitemap.md
├── 06-design-system.md
├── 07-qa-report.md
├── 19-handover.md
├── web/                  ← 실제 코드 (Vite 프로젝트)
└── supabase/             ← 스키마 · 마이그레이션
```

### 5.2 state.md 템플릿
```markdown
# {client} — Project State
- stage: 4-build
- lead_pm: orchestrator
- active_agents: [07, 08, 09]
- blockers: []
- next_gate: QA 착수 전 승인
- last_update: 2026-04-12
```

### 5.3 에이전트 호출 규칙
- 모든 에이전트 호출 전에 `state.md`를 읽어 현재 단계를 확인
- 호출 후 반드시 `state.md` 갱신
- 에이전트는 본인 출력을 정해진 파일명으로 저장 (중복 금지)

---

## 6. 품질 게이트 (Gate Review)

각 단계 종료 시 Orchestrator가 사람 오퍼레이터에게 **승인 요청**.

| Gate | 산출물 | 승인 기준 |
|---|---|---|
| G1 Discovery | 01-discovery.md | 기능·예산·일정 확정 |
| G2 Proposal | 02-proposal.md | 고객 서명 |
| G3 Design | 05, 06 파일 | 와이어프레임 고객 OK |
| G4 Build | web/ 동작 데모 | 스테이징 URL 확인 |
| G5 QA | 07-qa-report.md | Critical 버그 0건 |
| G6 Launch | 프로덕션 URL | 고객 인수 완료 |

**룰**: 게이트를 통과하지 못한 산출물로 다음 단계에 진입 금지. 이 룰이 에이전트 기반 운영의 안전장치다.

---

## 7. 상품 / 가격 (달팽이 DFY와 통합)

| 패키지 | 가격 | 납기 | 투입 에이전트 |
|---|---|---|---|
| 🌱 스타터 | 300만원 | 2주 | 01·02·04·05·06·07·12·15·16·19 |
| 🚀 비즈니스 | 600만원 | 3주 | + 08·09·12·17 |
| 💎 프리미엄 | 900만원 | 4주 | 전체 20명 |
| 🏢 엔터프라이즈 | 1,500만~ | 협의 | 전체 + 커스텀 에이전트 |

**유지보수 플랜**
- 기본 30만원/월 — `[18]` Support Agent 상시 대기
- 성장관리 50만원/월 — `[17]` 월간 리포트 추가
- 전담운영 100만원/월 — `[09]` 자동화 확장 + `[17]` 주간 리포트

---

## 8. 손익 구조

### 8.1 원가 계산 (월)
| 항목 | 금액 |
|---|---|
| Claude API (Opus/Sonnet) | ~200만원 |
| Vercel Pro × N | ~30만원 |
| Supabase Pro × N | ~30만원 |
| n8n 셀프호스트 | ~5만원 |
| 툴(Linear, Notion, Slack) | ~10만원 |
| 사람 오퍼레이터 1~2명 인건비 | 600~1,000만원 |
| **합계** | **약 900~1,300만원** |

### 8.2 목표 매출
- 동시 5 프로젝트 평균 600만원 × 월 2 런칭 = 월 6,000만원
- 유지보수 20건 × 평균 50만원 = 월 1,000만원
- **월 매출 목표: 7,000만원 / 마진: 약 75%**

---

## 9. 사람 오퍼레이터의 역할

20명 에이전트를 운영하는 **사람 1~2명의 책임**:

1. **고객 접점** — 미팅, 계약, 결제, 분쟁 조정
2. **게이트 승인** — G1~G6 모든 승인 결정
3. **프롬프트 관리** — 에이전트 시스템 프롬프트 버전 관리·개선
4. **컨텍스트 주입** — 고객별 특수 요구를 Orchestrator에 전달
5. **품질 최종 책임** — 에이전트가 놓친 것을 발견·수정
6. **전략 결정** — 신규 에이전트 추가 여부, 스택 변경 여부

**사람이 해서는 안 되는 일**: 직접 코딩, 직접 카피 작성, 직접 디자인. 사람이 하기 시작하면 에이전시가 망한다.

---

## 10. 확장 로드맵

### Phase 1 (0~3개월) — 뼈대
- 20개 에이전트 프롬프트 v1 작성
- 파일럿 프로젝트 3건 (달팽이 내부 프로젝트로 테스트)
- state.md 기반 오케스트레이션 확립

### Phase 2 (3~6개월) — 외부 수주
- 아카데미 졸업생 대상 먼저 영업
- 월 2~3 프로젝트 수주
- QA/Performance 에이전트 자동 리포트 정착

### Phase 3 (6~12개월) — 표준화
- 동시 5 프로젝트 병렬
- 에이전트 프롬프트 v2 (피드백 반영)
- 월매출 5,000만원 돌파

### Phase 4 (12~24개월) — 생태계
- 아카데미 졸업생 티칭프로를 오퍼레이터로 편입
- 엔터프라이즈 라인 런칭
- 에이전트 일부를 외부 고객에게 "SaaS형 에이전트"로 판매

---

## 11. 금기사항 (Do Not)

1. **사람이 직접 코드 작성 금지** — 오퍼레이터가 코딩하기 시작하면 본질 훼손
2. **에이전트에게 스택 자유 선택 허용 금지** — 반드시 §1 고정 스택만
3. **게이트 스킵 금지** — "급하니까 G3 건너뛰자" 절대 금지
4. **state.md 없이 에이전트 호출 금지** — 컨텍스트 없이 돌리면 품질 붕괴
5. **에이전트 프롬프트 즉흥 수정 금지** — 변경은 반드시 git 커밋 + 이유 기록
6. **고객 데이터 에이전트에 평문 노출 금지** — 개인정보는 환경변수/Supabase에만

---

## 12. 다음 작업 (실행 To-Do)

- [ ] 본 문서 승인 → 프롬프트 템플릿 작성 착수
- [ ] `/projects/_template/` 디렉토리 구조 생성
- [ ] 에이전트 20명 v1 프롬프트 개별 파일로 작성 (`agents-webdev/` 디렉토리 확장)
- [ ] state.md 샘플 + 핸드오프 스크립트 작성
- [ ] 파일럿 프로젝트 1건 선정 (달팽이 멤버십 사이트 리뉴얼 or 신규)
- [ ] 손익 계산 실측 (3개월 파일럿 후 재계산)

---

*본 지침서는 에이전트 기반 에이전시의 조직 설계도이며, 운영 중 지속적으로 버전업됩니다. 수정 시 변경 이유를 커밋 메시지에 남기세요.*
