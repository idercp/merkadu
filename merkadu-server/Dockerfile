# Estágio 1: Build
FROM node:20-alpine AS builder

# VITAL: Recebe o argumento de memória do docker-compose
ARG NODE_OPTIONS

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++ gcc avahi-dev

COPY package*.json ./
# Otimização para poupar memória no install
# CONFIGURAÇÃO DE MEMÓRIA PARA O NPM (Resolve o erro 228)
RUN npm uninstall mdns2 && \
    npm config set maxsockets 1 && \
    npm config set progress false && \
    npm install --network-concurrency 1 && \
    npm cache clean --force

COPY . .

# O build agora usará o Swap de 2GB graças ao NODE_OPTIONS
RUN npm run build

# Estágio 2: Run (Imagem leve para produção)
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia os ficheiros necessários para a execução
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
# 2. Garanta que a pasta static é copiada (essencial para imagens e CSS no Next.js)
COPY --from=builder /usr/src/app/static ./static 
COPY --from=builder /usr/src/app/apps/server/dist ./apps/server/dist 

EXPOSE 3000
CMD ["node", "dist/index.js"]