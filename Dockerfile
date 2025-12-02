# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install only production deps
RUN npm install --production

# Copy the rest of the code
COPY . .

# Expose port 4001
EXPOSE 4001

# Start the app
CMD ["node", "server.js"]
