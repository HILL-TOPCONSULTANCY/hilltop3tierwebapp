# Use an official Nginx image as the base
FROM nginx:latest

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy frontend files into the Nginx HTML directory
COPY index.html .
COPY style.css .
COPY app.js .

# Expose port 80 to serve the frontend
EXPOSE 80

# Start Nginx (CMD is inherited from the Nginx base image)
