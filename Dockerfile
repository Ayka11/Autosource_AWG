# Use official Node.js image from Docker Hub
FROM node:20-lts

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app's files
COPY . .

# Expose port 8080
EXPOSE 8080

# Run the app
CMD ["npm", "start"]
