# Build stage
FROM node:latest AS builder

# Set working directory
WORKDIR /usr/src/app/crm

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copy all other application files
COPY . .

# Run build script if needed (ensure you have a build script in package.json)
RUN npm run build

# Production stage
FROM node:latest AS production

# Set working directory
WORKDIR /usr/src/app

# Copy files from the build stage
COPY --from=builder /usr/src/app ./

# Install production dependencies only
RUN npm install --only=production --legacy-peer-deps

# Expose the necessary port
EXPOSE 4101

# Set environment variable for production
ENV NODE_ENV=production

# Command to start the application
CMD ["npm", "start"]
