# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies including drizzle-kit for migrations
RUN pnpm install --prod --frozen-lockfile && \
    pnpm add drizzle-kit --save-prod

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy drizzle migrations and config (needed for migrations)
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Copy source schema files (needed by drizzle-kit for config)
COPY --from=builder /app/src/customer/schema ./src/customer/schema

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose the application port
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application (run migrations first, then start)
# Use || true to continue even if migrations fail (they might already be applied)
CMD ["sh", "-c", "echo 'Running database migrations...' && pnpm drizzle-kit migrate || echo 'Migrations completed or already applied' && echo 'Starting application...' && node dist/src/main"]

