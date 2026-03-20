FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/

USER node

CMD ["npx", "tsx", "src/index.ts"]
