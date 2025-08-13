# Builder stage: install dependencies and build the Next.js app
FROM oven/bun:1 AS builder
WORKDIR /app

# Ensure build doesn't fail due to missing runtime env vars
ENV SKIP_ENV_VALIDATION=1

# Copy package manifests first for better cache usage
COPY package.json bun.lockb* ./

# Copy the rest of the source
COPY . .

# Install all dependencies and build the Next.js app
RUN bun install && bun run build

# Runtime stage: copy built artifacts and run the production server
FROM oven/bun:1 AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built app and node_modules from builder
COPY --from=builder /app /app

EXPOSE 3000

# Run migrations before starting the Next production server
CMD ["sh", "-c", "until bunx knex migrate:latest; do echo 'Waiting for DB to be ready...'; sleep 2; done && bun run start -H 0.0.0.0"]
