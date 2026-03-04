# =========================
# Estágio 1: Build
# =========================
FROM node:20-alpine AS builder

# Recebe opções de memória do docker-compose / CI
ARG NODE_OPTIONS

WORKDIR /usr/src/app

# Dependências necessárias para node-gyp (caso outras libs precisem)
RUN apk add --no-cache python3 make g++ gcc

# Copia apenas manifests para aproveitar cache
COPY package.json package-lock.json ./

# Instala dependências:
# --omit=optional evita mdns2 e outros módulos nativos problemáticos
# network-concurrency reduz consumo de memória no CI
RUN npm config set maxsockets 1 && \
    npm config set progress false && \
    npm install --omit=optional --network-concurrency 1 && \
    npm cache clean --force

# Copia o restante código
COPY . .

# Build da aplicação
RUN npm run build


# =========================
# Estágio 2: Runtime
# =========================
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia apenas o necessário para produção
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# Ajusta conforme o teu projeto
COPY --from=builder /usr/src/app/static ./static
COPY --from=builder /usr/src/app/apps/server/dist ./apps/server/dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/index.js"]