FROM node:20-alpine

WORKDIR /app

# 复制 npmrc 文件
COPY .npmrc ./
RUN npm config set registry https://registry.npmmirror.com || true

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]