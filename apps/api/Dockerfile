# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY ../../package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ../../turbo.json ../../tsconfig.base.json ./ 
COPY ../../apps ./apps
COPY ../../packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm -w build:all
RUN pnpm --filter=api deploy --prod /out

# ---- runtime ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /out/ /app/

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "apps/api/dist/server.js"]
