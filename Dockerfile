# 빌드단계: 
# 빌드 환경을 구성 최종단계에는 반영 X
FROM node:20-alpine AS build

# 네이티브 모듈 설치 (bcrypt를 위해서)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 패키지 파일 복사
COPY package.json pnpm-lock.yaml ./

# pnpm 설치
RUN npm install -g pnpm

# 의존성 설치 (개발 의존성 포함)
RUN pnpm install --frozen-lockfile

# application 소스코드 복사
COPY . .

# 빌드
RUN pnpm run build

# 프로덕션 단계:
# 빌드단계에서 생성된 빌드된 결과물에서 배포에 필요한 파일만 가져오는 단계
FROM node:20-alpine AS production

# 폴더 생성
WORKDIR /app

# 런타임 의존성 설치
RUN apk add --no-cache openssh

# pnpm 설치
RUN npm install -g pnpm

# 패키지 파일 복사
COPY package.json pnpm-lock.yaml ./

# 프로덕션에서 필요한 의존성만 설치 (개발 의존성 X)
RUN pnpm install --frozen-lockfile --prod

# 빌드 단계에서 빌드한 결과중 /app/dist 빌드결과만 가져옴
COPY --from=build /app/dist ./dist

# 템플릿파일 복사 (Handlebars 템플릿)
COPY --from=build /app/src/ai/prompt/templates ./dist/ai/prompt/templates

# Expose port (default port is 3000)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]