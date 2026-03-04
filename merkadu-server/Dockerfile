# Estágio 1: Build
FROM node:20-alpine AS builder

# VITAL: Recebe o argumento de memória do docker-compose
ARG NODE_OPTIONS

WORKDIR /usr/src/app

COPY package*.json ./
# Otimização para poupar memória no install
# CONFIGURAÇÃO DE MEMÓRIA PARA O NPM (Resolve o erro 228)
RUN npm config set maxsockets 1 && \
    npm config set progress false && \
    npm install --network-concurrency 1

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
# Adicione esta linha para garantir que o standalone do Next.js/Vendure funcione
COPY --from=builder /usr/src/app/apps/server/dist ./apps/server/dist 

EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/index.js"]