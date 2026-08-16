# Stage 1: Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package definitions
COPY package*.json ./

# Install all dependencies (including devDependencies required for Vite & Esbuild)
RUN npm install

# Copy source code
COPY tsconfig.json ./
COPY frontend ./frontend
COPY backend ./backend

# Build production bundle (compiles frontend assets & backend server into /app/dist)
RUN npm run build

# Stage 2: Production runner stage
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package definitions and install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev --no-audit

# Copy compiled dist folder from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
