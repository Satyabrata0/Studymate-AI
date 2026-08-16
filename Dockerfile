FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package definitions and install production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production --legacy-peer-deps || npm install --only=production

# Copy compiled production dist directory
COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
