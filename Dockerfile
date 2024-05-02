FROM node:20-alpine as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY package.json yarn.lock ./
# Install dependencies
RUN yarn install

COPY . .
# Build the app
RUN yarn build

# Bundle static assets with nginx
FROM nginx:latest as production
# Copy built assets from `builder` image
COPY --from=builder /app/dist /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 3001
# Start nginx
CMD ["nginx", "-g", "daemon off;"]