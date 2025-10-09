# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm -v
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine as production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]