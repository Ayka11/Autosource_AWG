# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json /app
RUN npm install

# Copy the rest of the application code
COPY . /app

# Build the React app for production
RUN npm run build

# Install and configure Nginx to serve the React app
RUN apt-get update && apt-get install -y nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose the port that the app will run on
EXPOSE 8080

# Run the app with Nginx
CMD ["nginx", "-g", "daemon off;"]
