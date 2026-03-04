# =========================
# Estágio 1: Build (Ambiente de Compilação)
# =========================
FROM node:20-alpine AS builder

# Argumento para o Next.js/Vendure usar memória virtual (Swap)
ARG NODE_OPTIONS

WORKDIR /usr/src/app

# Instala ferramentas básicas necessárias para o ecossistema Node em Alpine
RUN apk add --no-cache python3 make g++ gcc

# Copia apenas os ficheiros de dependências primeiro (otimiza o cache do Docker)
COPY package*.json ./

# REMOVA O --ignore-scripts para permitir a compilação de binários nativos
RUN npm config set maxsockets 1 && \
    npm config set progress false && \
    npm install --network-concurrency 1 && \
    npm cache clean --force

# Copia todo o código fonte do Merkadu para dentro do contentor
COPY . .

# Forçamos o build a usar 2GB de RAM
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

# =========================
# Estágio 2: Runtime
# =========================
FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copiamos apenas o estritamente necessário do builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/static ./static
COPY --from=builder /usr/src/app/apps/server/dist ./apps/server/dist

EXPOSE 3000

CMD ["node", "dist/index.js"]