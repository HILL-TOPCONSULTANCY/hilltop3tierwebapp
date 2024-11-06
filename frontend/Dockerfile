# Use an official Nginx image as the base
FROM nginx:latest

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy all HTML, CSS, and JavaScript files into the Nginx HTML directory
COPY . .

# Expose port 80 to serve the frontend
EXPOSE 80

# Start Nginx (CMD is inherited from the Nginx base image)
