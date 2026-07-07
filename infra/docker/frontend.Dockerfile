FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY apps/storefront/package.json apps/storefront/package.json
COPY apps/admin-panel/package.json apps/admin-panel/package.json
RUN corepack enable && pnpm install --frozen-lockfile=false

COPY . .

CMD ["pnpm", "dev:storefront"]

