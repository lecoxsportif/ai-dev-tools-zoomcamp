# Stage 1: Build the Client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup the Server
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

# Stage 3: Assemble
WORKDIR /app
COPY server/ ./server/
# Copy built static files from Stage 1 to where the server expects them
COPY --from=client-build /app/client/dist ./client/dist

# Expose the API/WebSocket port
EXPOSE 3001

# Start the server (using index.js directly, not the dev runner)
CMD ["node", "server/index.js"]
