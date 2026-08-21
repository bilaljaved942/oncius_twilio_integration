# ==============================================================================
# STAGE 1: Build React Frontend
# ==============================================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/client

# Copy client dependencies and install
COPY client/package*.json ./
RUN npm ci

# Copy client source code and build production assets
COPY client/ ./
RUN npm run build

# ==============================================================================
# STAGE 2: Production Server
# ==============================================================================
FROM node:20-alpine

WORKDIR /app

# Set node environment
ENV NODE_ENV=production
ENV PORT=5050

# Copy root server package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy server application code
COPY server.js ./
COPY routes/ ./routes/
COPY data/ ./data/

# Copy built frontend assets from STAGE 1
COPY --from=frontend-builder /app/client/dist ./client/dist

# Expose server port
EXPOSE 5050

# Start server
CMD ["npm", "start"]
