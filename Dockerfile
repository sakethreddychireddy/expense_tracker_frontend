# Stage 1: Build the React app
FROM node:18-alpine AS build

# Fix DNS for npm install (works even behind Jenkins or Docker bridge)
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf && \
    echo "nameserver 8.8.4.4" >> /etc/resolv.conf

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve app using Nginx
FROM nginx:alpine

# Copy the build output to Nginx’s html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for container access
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
