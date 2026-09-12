FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY services/chat-service/package.json services/chat-service/yarn.lock ./

RUN yarn install --frozen-lockfile && \
    yarn cache clean

COPY services/chat-service .

RUN yarn prisma generate

RUN yarn build

FROM node:22-alpine

WORKDIR /app

RUN corepack enable

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeuser

COPY --chown=nodeuser:nodejs services/chat-service/package.json services/chat-service/yarn.lock ./


RUN yarn install --frozen-lockfile --production=true  && \
    yarn cache clean

RUN mkdir -p /app/logs && \
    chown nodeuser:nodejs /app/logs    

COPY --chown=nodeuser:nodejs --from=builder /app/dist ./dist

COPY --chown=nodeuser:nodejs --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --chown=nodeuser:nodejs --from=builder /app/prisma ./prisma

COPY --chown=nodeuser:nodejs --from=builder /app/prisma.config.ts ./prisma.config.ts


USER nodeuser

EXPOSE 9103

CMD ["sh", "-c", "yarn prisma migrate deploy && node dist/main.js"]




