# BUILD STAGE 
FROM node:20-bookworm AS builder
WORKDIR /app

# COPY DEPENCIES
COPY package*.json ./
RUN npm ci --omit=dev

# COPY SOURCE FILES
COPY index.js ./

# RUNTIME STAGE
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app

# COPY ONLY THE NECESSARY RUNTIME ARTIFACTS
COPY --from=builder /app .

EXPOSE 3000

CMD ["index.js"]