FROM oven/bun:1 AS base

WORKDIR /app

COPY package.json bun.lock ./
COPY tsconfig.json ./
COPY apps ./apps
COPY packages ./packages
COPY docs ./docs

RUN bun install --frozen-lockfile

ARG APP_NAME
ENV APP_NAME=${APP_NAME}
ENV NODE_ENV=production

EXPOSE 4000 4001 4002 4003

CMD ["sh", "-c", "bun apps/${APP_NAME}/src/index.ts"]
