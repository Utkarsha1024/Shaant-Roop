# ═══════════════════════════════════════════════════════════════════════
# Shaant Roop — Next.js Frontend  |  Multi-stage Dockerfile
# Brand: Deep Forest Green (#1E5021) + Warm Gold (#F5B800)
#
# Stage 1 (builder) — install deps + build
# Stage 2 (runner)  — copy minimal standalone output, serve on :3000
# ═══════════════════════════════════════════════════════════════════════

# ──────────────────────────────────────────────────────────────────────
# Stage 1: Build
# ──────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (cached layer — only re-runs when lockfile changes)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the full source
COPY . .

# ── Build-time environment variables ──────────────────────────────────
# NEXT_PUBLIC_* values are inlined into the JS bundle at build time,
# so they MUST be provided here (not at runtime).
# Override these via --build-arg when building the image, e.g.:
#   docker build \
#     --build-arg NEXT_PUBLIC_API_URL=https://api.shaantroop.com \
#     --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx \
#     -t shaantroop-web .
ARG NEXT_PUBLIC_API_URL=http://localhost:8085
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID=""

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Produce the standalone + static output under .next/
RUN npm run build

# ──────────────────────────────────────────────────────────────────────
# Stage 2: Production Runner
# ──────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Security: run as a non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# The standalone build is a self-contained Node server — no full
# node_modules needed at runtime, keeping the image minimal.
COPY --from=builder /app/.next/standalone ./

# Static assets (.next/static/) and the public/ directory must live
# alongside the standalone server so it can serve them correctly.
COPY --from=builder /app/.next/static  ./.next/static
COPY --from=builder /app/public        ./public

# Apply correct ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

# ── Brand environment reminder ────────────────────────────────────────
# Deep Forest Green : #1E5021  (--color-green-600)
# Warm Gold         : #F5B800  (--color-gold-400)
# These tokens live in globals.css @theme and are compiled into the
# static CSS bundle — no runtime variable injection required.

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Next.js standalone entry point
ENTRYPOINT ["node", "server.js"]
