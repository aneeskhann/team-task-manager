# ─── Frontend Dockerfile ──────────────────────────────────────────────────────
# Multi-stage build: compiles the Vite app via Node, then serves the static
# dist/ folder using an ultra-lightweight Nginx alpine image.
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Pass backend URL at build time if needed (or configure nginx reverse proxy)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Stage 2: serve ───────────────────────────────────────────────────────────
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy Vite build output to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config to handle React Router (SPA fallback to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run sets PORT, we need nginx to listen on it
# (The default.conf we provide uses $PORT, which we substitute on startup)
ENV PORT=8080

EXPOSE $PORT

# Start NGINX and inject the dynamic PORT environment variable into the config
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.in && mv /etc/nginx/conf.d/default.conf.in /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
