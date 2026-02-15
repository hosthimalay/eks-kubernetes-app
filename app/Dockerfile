# ==============================================================================
# Multi-stage Dockerfile — lean production image
# Stage 1: Install dependencies
# Stage 2: Copy only what's needed into a minimal runtime image
# ==============================================================================

# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (layer caching — only reinstalls when deps change)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only production node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY server.js .

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

# Health check for Docker (Kubernetes uses its own probes)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
