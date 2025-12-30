# stage 1: build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_WEATHER_API_KEY
ENV VITE_WEATHER_API_KEY=$VITE_WEATHER_API_KEY

# build the app
RUN npm run build

# stage 2: production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# start nginx
CMD ["nginx", "-g", "daemon off;"]

