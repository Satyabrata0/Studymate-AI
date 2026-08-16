# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package definition files
COPY package.json package-lock.json* ./

# Install all dependencies required for building
RUN npm ci --legacy-peer-deps || npm install

# Copy application code and configurations
COPY frontend ./frontend
COPY backend ./backend
COPY tsconfig.json ./

# Build frontend and backend production bundles
RUN npm run build

# Stage 2: Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment defaults
ENV NODE_ENV=production
ENV PORT=3000

# Copy package definitions and install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production --legacy-peer-deps || npm install --only=production

# Copy compiled dist artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Expose application port
EXPOSE 3000

# Start production server
CMD ["node", "dist/server.cjs"]
