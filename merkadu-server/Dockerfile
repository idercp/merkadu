# =========================
# Estágio 1: Build
# =========================
FROM node:20-alpine AS builder

# Argumento para o uso de memória virtual (essencial para t3.micro)
ARG NODE_OPTIONS

WORKDIR /usr/src/app

# Instalação de ferramentas de build básicas para o ecossistema Alpine
RUN apk add --no-cache python3 make g++ gcc

# Copia os manifestos de dependências
COPY package*.json ./

# SOLUÇÃO PARA MDNS2 + LIGHTNINGCSS:
# 1. Instalamos com --ignore-scripts para evitar o erro de compilação do mdns2.
# 2. Instalamos explicitamente o binário do lightningcss para Linux Alpine (musl), 
#    pois o Next.js 16 (Turbopack) precisa dele para processar o globals.css.
RUN npm config set maxsockets 1 && \
    npm config set progress false && \
    npm install --ignore-scripts --network-concurrency 1 && \
    npm install lightningcss-linux-x64-musl --save-optional --ignore-scripts && \
    npm cache clean --force

# Copia o código fonte do projeto
COPY . .

# SOLUÇÃO DE MEMÓRIA PARA O BUILD:
# Forçamos o build a usar até 2GB de RAM, aproveitando o swapfile de 2GB da sua EC2.
# Isto resolve o erro de "Error evaluating Node.js code" no globals.css.
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build


# =========================
# Estágio 2: Runtime (Produção)
# =========================
FROM node:20-alpine

WORKDIR /usr/src/app

# Define o ambiente como produção para otimizar o Node.js
ENV NODE_ENV=production

# Copia apenas o necessário do estágio de build para manter a imagem leve
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/static ./static
COPY --from=builder /usr/src/app/apps/server/dist ./apps/server/dist

# Expõe a porta que a aplicação utiliza
EXPOSE 3000

# Comando para iniciar o servidor Merkadu
CMD ["node", "dist/index.js"]