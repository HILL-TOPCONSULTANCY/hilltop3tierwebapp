# Use an official Node.js runtime as a base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Define environment variables (optional)
ENV MONGO_URL=mongodb://mongo:27017/mydatabase
ENV PORT=8080

# Run the application
CMD ["npm", "start"]
