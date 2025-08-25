# Official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY Backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend code
COPY Backend/. .

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
