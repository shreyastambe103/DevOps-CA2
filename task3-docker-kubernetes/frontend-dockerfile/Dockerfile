# Use official Node.js image as base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy frontend files
COPY . .

# Install dependencies
RUN npm install

# Build the frontend
RUN npm run build

# Expose port (optional, for serving static files)
EXPOSE 3000

# Serve the built files using a simple server
RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "3000"]
