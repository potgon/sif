# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Copy built assets from the build stage
# COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
# COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Set environment variables
ENV PORT 3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
