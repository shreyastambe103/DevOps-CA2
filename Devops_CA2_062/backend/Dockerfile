# backend/Dockerfile

# Use Node.js 18 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Install curl for health checks (alpine doesn't have it by default)
RUN apk add --no-cache curl

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Health check - using curl
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5000/ || exit 1

# Start application
CMD ["node", "server.js"]