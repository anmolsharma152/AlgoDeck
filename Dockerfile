FROM node:20-alpine

# Install Python 3 for code execution runner
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy dependency manifests & install production modules
COPY package*.json ./
RUN npm ci --only=production

# Copy source code and assets
COPY public/ ./public/
COPY server/ ./server/
COPY content/ ./content/
COPY docs/ ./docs/
COPY tests/ ./tests/

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server/server.js"]
