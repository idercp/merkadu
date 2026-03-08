# =========================
# Estágio 1: Build
# =========================
FROM node:20-alpine AS builder

ARG VENDURE_SHOP_API_URL
ARG NEXT_PUBLIC_VENDURE_SHOP_API_URL
ARG NODE_OPTIONS

# Injeta as variáveis para o processo de build
ENV VENDURE_SHOP_API_URL=$VENDURE_SHOP_API_URL
ENV NEXT_PUBLIC_VENDURE_SHOP_API_URL=$NEXT_PUBLIC_VENDURE_SHOP_API_URL
ENV NODE_OPTIONS=$NODE_OPTIONS

WORKDIR /usr/src/app
RUN apk add --no-cache python3 make g++ gcc

COPY package*.json ./

RUN npm config set maxsockets 1 && \
    npm install --ignore-scripts && \
    npm install --save-optional --ignore-scripts \
        lightningcss-linux-x64-musl \
        @tailwindcss/oxide-linux-x64-musl \
        @next/swc-linux-x64-musl

COPY . .

# Cria pastas para evitar erro lstat no build da API
RUN mkdir -p ./.next/standalone ./.next/static ./public ./static ./dist

RUN npm run build

# LIMPEZA DE CACHE: Vital para não estourar os 4.0GB de disco da t3.micro
RUN rm -rf .next/cache

# =========================
# Estágio 2: Runtime
# =========================
FROM node:20-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Re-declaramos os argumentos para que o estágio final também os possua
ARG VENDURE_SHOP_API_URL
ARG NEXT_PUBLIC_VENDURE_SHOP_API_URL
ENV VENDURE_SHOP_API_URL=$VENDURE_SHOP_API_URL
ENV NEXT_PUBLIC_VENDURE_SHOP_API_URL=$NEXT_PUBLIC_VENDURE_SHOP_API_URL

RUN mkdir -p ./dist ./.next/static ./public ./static

COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist* ./dist/
COPY --from=builder /usr/src/app/.next/standalone* ./
COPY --from=builder /usr/src/app/.next/static* ./.next/static/
COPY --from=builder /usr/src/app/public* ./public/
COPY --from=builder /usr/src/app/static* ./static/

EXPOSE 3000
CMD if [ -f "server.js" ]; then node server.js; else node dist/index.js; fi