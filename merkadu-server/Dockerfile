# =========================
# Estágio 1: Build
# =========================
FROM node:20-alpine AS builder

# Recebe opções de memória do docker-compose (essencial para t3.micro)
ARG NODE_OPTIONS

WORKDIR /usr/src/app

# Toolchain mínima para evitar erros de gyp em outras libs
RUN apk add --no-cache python3 make g++ gcc

# Copiamos apenas o package.json (Já que não temos o lockfile)
COPY package.json ./

# SOLUÇÃO REAL: --omit=optional ignora o mdns2 e outros módulos problemáticos
# network-concurrency 1 evita que a RAM de 1GB da t3.micro esgote
RUN npm config set maxsockets 1 && \
    npm config set progress false && \
    npm install --omit=optional --network-concurrency 1 && \
    npm cache clean --force

# Copia o restante do código do Merkadu
COPY . .

# Build da aplicação (Usará o Swap de 2GB que configurámos)
RUN npm run build


# =========================
# Estágio 2: Runtime (Produção)
# =========================
FROM node:20-alpine

WORKDIR /usr/src/app

# Variável vital para performance na AWS
ENV NODE_ENV=production

# Copia apenas o necessário para a imagem final ser leve
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/static ./static
COPY --from=builder /usr/src/app/apps/server/dist ./apps/server/dist

EXPOSE 3000

# Comando de arranque direto
CMD ["node", "dist/index.js"]