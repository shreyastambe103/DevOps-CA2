# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies inside container
RUN npm install --production

# Copy the rest of the app (do NOT copy node_modules from host)
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "index.js"]
