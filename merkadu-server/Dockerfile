# =========================
# Estágio 1: Build
# =========================
FROM node:20-alpine AS builder

ARG VENDURE_SHOP_API_URL
ARG NEXT_PUBLIC_VENDURE_SHOP_API_URL
ARG NODE_OPTIONS

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
RUN npm run build

# =========================
# Estágio 2: Runtime
# =========================
FROM node:20-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Variáveis para o funcionamento da loja
ENV VENDURE_SHOP_API_URL=$VENDURE_SHOP_API_URL
ENV NEXT_PUBLIC_VENDURE_SHOP_API_URL=$NEXT_PUBLIC_VENDURE_SHOP_API_URL

# Copia os ficheiros necessários para o modo standalone
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/static ./static

EXPOSE 3000
CMD ["node", "server.js"]