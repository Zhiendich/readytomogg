FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY services/payment-service/package.json services/payment-service/yarn.lock ./

RUN yarn install --frozen-lockfile && \
    yarn cache clean

COPY services/payment-service .

RUN yarn prisma generate

RUN yarn build

FROM node:22-alpine

WORKDIR /app

RUN corepack enable

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeuser

COPY --chown=nodeuser:nodejs services/payment-service/package.json services/payment-service/yarn.lock ./

RUN yarn install --frozen-lockfile --production=true  && \
    yarn cache clean


RUN mkdir -p /app/logs && \
    chown nodeuser:nodejs /app/logs   

COPY --chown=nodeuser:nodejs --from=builder /app/dist ./dist

COPY --chown=nodeuser:nodejs --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --chown=nodeuser:nodejs --from=builder /app/prisma ./prisma

COPY --chown=nodeuser:nodejs --from=builder /app/prisma.config.ts ./prisma.config.ts


USER nodeuser


EXPOSE 9104


CMD ["sh", "-c", "yarn prisma migrate deploy && node dist/main.js"]
