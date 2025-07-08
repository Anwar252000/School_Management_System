# # Use official Node.js image as base
# FROM node:18-alpine AS builder

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package.json package-lock.json ./

# # Install dependencies
# RUN npm install --production

# # Copy the rest of the application
# COPY . .

# # Build the project
# RUN npm run build

# # Create a new image for the final production build
# FROM node:18-alpine AS runner

# # Set working directory inside runner container
# WORKDIR /app

# # Copy necessary files from the builder stage
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next/static ./.next/static

# # Expose port 3000 (default for Next.js)
#  EXPOSE 3000
# # EXPOSE 80

# # Start the standalone Next.js server
# CMD ["node", "server.js"]

# ---------- Build Stage ----------
# ------------------- Build Stage -------------------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Use public registry to avoid auth issues
RUN npm config set registry https://registry.npmjs.org/

# Copy only package files first (to optimize caching)
COPY ./Frontend_UI/package*.json ./

# Install dependencies
RUN npm install

# Copy the full app source
COPY ./Frontend_UI ./

# Build the app
RUN npm run build

# ------------------- Production Stage -------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=80

# Copy necessary files from build stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port CapRover expects
EXPOSE 80

# Start the app using Next.js
CMD ["npm", "start"]
