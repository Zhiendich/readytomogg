FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY services/auth-service/package.json services/auth-service/yarn.lock ./

RUN yarn install --frozen-lockfile && \
    yarn cache clean

COPY services/auth-service .

RUN yarn build

FROM node:22-alpine

WORKDIR /app

RUN corepack enable

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeuser

COPY --chown=nodeuser:nodejs services/auth-service/package.json services/auth-service/yarn.lock ./

RUN yarn install --frozen-lockfile --production=true  && \
    yarn cache clean


 RUN mkdir -p /app/logs && \
    chown nodeuser:nodejs /app/logs

COPY --chown=nodeuser:nodejs --from=builder /app/dist ./dist

USER nodeuser

EXPOSE 9101

CMD ["node", "dist/main.js"]
