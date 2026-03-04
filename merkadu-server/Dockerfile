#=========================
# Estágio 1: Build
# =========================
FROM node:20-alpine AS builder

# 1. Declaramos os argumentos que vêm do docker-compose
ARG VENDURE_SHOP_API_URL
ARG NEXT_PUBLIC_VENDURE_SHOP_API_URL
ARG NODE_OPTIONS

# 2. VITAL: Transformamos os ARG em ENV. 
# Sem isto, o "npm run build" não consegue ler os valores.
ENV VENDURE_SHOP_API_URL=$VENDURE_SHOP_API_URL
ENV NEXT_PUBLIC_VENDURE_SHOP_API_URL=$NEXT_PUBLIC_VENDURE_SHOP_API_URL
ENV NODE_OPTIONS=$NODE_OPTIONS

WORKDIR /usr/src/app
RUN apk add --no-cache python3 make g++ gcc

COPY package*.json ./

RUN npm config set maxsockets 1 && \
    npm config set progress false && \
    npm install --ignore-scripts --network-concurrency 1 && \
    npm install --save-optional --ignore-scripts \
        lightningcss-linux-x64-musl \
        @tailwindcss/oxide-linux-x64-musl \
        @next/swc-linux-x64-musl && \
    npm cache clean --force

COPY . .

# SOLUÇÃO PARA O LSTAT: Cria as pastas no builder para que o COPY não falhe na API
RUN mkdir -p ./.next/standalone ./.next/static ./public ./static ./dist

RUN npm run build

# =========================
# Estágio 2: Runtime
# =========================
FROM node:20-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production

ENV VENDURE_SHOP_API_URL=$VENDURE_SHOP_API_URL
ENV NEXT_PUBLIC_VENDURE_SHOP_API_URL=$NEXT_PUBLIC_VENDURE_SHOP_API_URL

# Cria as pastas no runtime para segurança
RUN mkdir -p ./dist ./.next/static ./public ./static

COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Cópias com asterisco agora são seguras pois a origem (.next) existe no builder
COPY --from=builder /usr/src/app/dist* ./dist/
COPY --from=builder /usr/src/app/.next/standalone* ./
COPY --from=builder /usr/src/app/.next/static* ./.next/static/
COPY --from=builder /usr/src/app/public* ./public/
COPY --from=builder /usr/src/app/static* ./static/

EXPOSE 3000
CMD if [ -f "server.js" ]; then node server.js; else node dist/index.js; fi