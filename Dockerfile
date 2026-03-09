# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install --legacy-peer-deps --ignore-scripts

# Copy source files
COPY . .

# Build Nuxt app
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install only production dependencies
COPY package.json ./
RUN npm install --production --legacy-peer-deps --ignore-scripts && \
    npm cache clean --force

# Copy built app from builder
COPY --from=builder /app/.output /app/.output

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start command
CMD ["node", ".output/server/index.mjs"]
