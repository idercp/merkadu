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

# SOLUÇÃO PARA O ERRO MDNS2 E MEMÓRIA (Erro 228):
# 1. --ignore-scripts: Impede o mdns2 de tentar compilar código C++ incompatível.
# 2. --network-concurrency 1: Evita picos de RAM durante o download na t3.micro.
RUN npm config set maxsockets 1 && \
    npm config set progress false && \
    npm install --ignore-scripts --network-concurrency 1 && \
    npm cache clean --force

# Copia todo o código fonte do Merkadu para dentro do contentor
COPY . .

# SOLUÇÃO PARA O ERRO NO GLOBALS.CSS:
# Forçamos o build a usar 2GB de RAM (usando o seu Swap de 2GB na EC2)
# Isto evita que o processo "crash" ao compilar o CSS do Storefront.
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build


# =========================
# Estágio 2: Runtime (Imagem Final de Produção)
# =========================
FROM node:20-alpine

WORKDIR /usr/src/app

# Define o ambiente como produção para otimizar o Node.js na AWS
ENV NODE_ENV=production

# Copiamos apenas o estritamente necessário do builder para manter a imagem leve
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/static ./static
COPY --from=builder /usr/src/app/apps/server/dist ./apps/server/dist

# Porta padrão que a sua aplicação utiliza
EXPOSE 3000

# Comando para iniciar a aplicação diretamente pelo binário do Node
CMD ["node", "dist/index.js"]