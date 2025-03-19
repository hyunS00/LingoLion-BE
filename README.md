# 🦁 Lingo Lion

### 사용자 맞춤형 상황별 AI 영어회화 서비스

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FhyunS00%2FLingoLion-BE&count_bg=%23FFA905&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)

<br>

<div align=center>
  <img width="200px;" src="https://github.com/user-attachments/assets/c1bc9d91-2d87-4f7c-af89-cf79589e38bd"/>
</div>

<br>

> **맞춤형 영어회화 연습을 위한 AI 에이전트 서비스** <br/> **개발기간: 2025.02 ~ 진행중**

<br>

## 🦁 프로젝트 소개

**Lingo Lion**은 AI 기반의 맞춤형 영어회화 연습 서비스입니다. 사용자의 수준과 관심사에 맞는 다양한 상황에서 자연스러운 영어 대화를 경험할 수 있습니다.

### ✔ 서비스 핵심 가치

- **접근성**: 시간과 장소에 구애받지 않고 언제 어디서나 영어 회화 연습
- **맞춤형 학습**: 사용자의 수준과 관심사에 맞는 상황별 대화 시나리오 제공
  <!-- - **실시간 피드백**: 즉각적인 문법 교정과 표현 개선 제안 -->
  <!-- - **지속적 성장**: 학습 진행 상황을 추적하여 효과적인 영어 실력 향상 지원 -->

<br>

## ⚙ 시스템 아키텍처

### 백엔드 아키텍처

<div align=center>
  <img width="800" alt="백엔드 아키텍처" src="https://github.com/user-attachments/assets/2630edd0-ee42-44e9-b06e-c8c7f2de3a8b">
</div>

<div id="aws">
  <h3>AWS 인프라</h3>
</div>

<div align=center>
  <img width="800" alt="AWS 인프라" src="https://github.com/user-attachments/assets/4349e750-3baf-4230-9feb-db670e90ddd3">
</div>

<div id="agent">
  <h3>Agent 워크플로우</h3>
</div>

<div align=center>
  <img width="800" alt="AWS 인프라" src="https://github.com/user-attachments/assets/71cabf2b-7dc1-4a87-895c-5e68623c8a13">
</div>

<br>

## 💡 주요 기능

### 상황별 맞춤 영어회화

- **다양한 대화 상황**: 식당, 병원, 호텔, 면접 등 실생활에서 마주할 수 있는 다양한 상황 제공
- **역할 플레이**: AI가 웨이터, 의사, 면접관 등 다양한 역할을 수행하여 실제 상황과 유사한 대화 경험 제공
<!-- - **난이도 조절**: 초급, 중급, 고급 등 사용자 수준에 맞는 대화 난이도 설정 -->

### AI 대화 에이전트

- **자연스러운 대화**: OpenAI의 최신 LLM을 활용한 자연스럽고 맥락을 이해하는 대화 진행
- **문법 교정**: 사용자의 영어 표현에 대한 자연스러운 문법 교정 제공
- **검색 기능**: 최신 정보나 전문적인 내용이 필요할 때 Tavily API를 통한 정보 검색 및 통합

### 안전한 인증 시스템

- **JWT + Opaque 토큰**: JWT Access Token과 Opaque Refresh Token을 활용한 이중 보안 인증
- **HTTP-only 쿠키**: 중요 인증 정보는 HTTP-only 쿠키에 저장하여 XSS 공격 방어
- **권한 관리**: 사용자 역할 기반의 접근 제어

<br>

## 🛠 기술 스택

### 백엔드

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-F37626?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Tavily](https://img.shields.io/badge/Tavily-000000?style=for-the-badge&logo=search&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Passport](https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white)
![Handlebars](https://img.shields.io/badge/Handlebars-F0772B?style=for-the-badge&logo=handlebarsdotjs&logoColor=white)

### 인프라 및 배포

![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

<!-- ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white) -->

![Neon](https://img.shields.io/badge/Neon-00E699?style=for-the-badge&logo=neon&logoColor=white)
