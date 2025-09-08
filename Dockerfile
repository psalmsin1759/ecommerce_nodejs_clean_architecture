FROM node:20-alpine AS builder


WORKDIR /app


COPY package*.json tsconfig.json ./


RUN npm install --legacy-peer-deps


COPY . .


RUN npm run build


FROM node:20-alpine AS runner

WORKDIR /app


COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist


ENV NODE_ENV=production
ENV PORT=3000


EXPOSE 3000


CMD ["node", "dist/index.js"]
