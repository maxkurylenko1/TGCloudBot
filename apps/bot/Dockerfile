# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY ../../package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ../../turbo.json ../../tsconfig.base.json ./ 
COPY ../../apps ./apps
COPY ../../packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm -w build:all
RUN pnpm --filter=bot deploy --prod /out

# ---- runtime ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/bot/dist ./apps/bot/dist
COPY --from=build /out/ /app/

CMD ["node", "apps/bot/dist/index.js"]
