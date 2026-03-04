# Estágio 1: Build
FROM node:20-alpine AS builder
ARG NODE_OPTIONS
WORKDIR /usr/src/app

# Ferramentas básicas para integridade
RUN apk add --no-cache python3 make g++ gcc

COPY package*.json ./

# SOLUÇÃO FINAL E DEFINITIVA
RUN npm config set maxsockets 1 && \
    npm config set progress false && \
    npm install --ignore-scripts --network-concurrency 1 && \
    npm cache clean --force

COPY . .
RUN npm run build

# Estágio 2: Runtime
FROM node:20-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copiamos as estruturas que o build do Merkadu gera
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/static ./static
COPY --from=builder /usr/src/app/apps/server/dist ./apps/server/dist

EXPOSE 3000

# Execução direta para estabilidade na AWS
CMD ["node", "dist/index.js"]