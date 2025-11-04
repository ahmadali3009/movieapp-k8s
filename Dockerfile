# Use Node.js as the base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy backend files only
COPY backend/ ./

# Install dependencies
RUN npm install

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]