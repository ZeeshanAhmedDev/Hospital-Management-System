FROM nginx:alpine

COPY public/ /usr/share/nginx/html/

# Expose port
EXPOSE 80

# Start engine
CMD ["nginx", "-g", "daemon off;"]

