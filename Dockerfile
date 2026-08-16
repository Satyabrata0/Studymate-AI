FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package management files
COPY package*.json ./

# Install production dependencies cleanly
RUN npm install --omit=dev --no-audit

# Copy production bundle
COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
