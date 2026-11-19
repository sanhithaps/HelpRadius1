# Multi-stage Dockerfile for Help Radius Frontend

# Stage 1: Build React Application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy application sources
COPY . .

# Build Arguments for Vite environment variables
ARG VITE_API_BASE_URL=/api
ARG VITE_FIREBASE_API_KEY=dummy_key
ARG VITE_FIREBASE_AUTH_DOMAIN=help-radius.firebaseapp.com
ARG VITE_FIREBASE_PROJECT_ID=help-radius-prototype
ARG VITE_FIREBASE_STORAGE_BUCKET=help-radius.appspot.com
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
ARG VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

# Build static assets
RUN npm run build

# Stage 2: Serve with Lightweight Production Nginx
FROM nginx:1.25-alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built distribution from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA fallback and API reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
