# Use official lightweight NGINX image
FROM nginx:alpine

# Copy your frontend files into NGINX's default public folder
COPY public/ /usr/share/nginx/html

# Expose default HTTP port
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
