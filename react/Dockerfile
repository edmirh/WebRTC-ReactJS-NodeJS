FROM node:14.11-slim as builder

WORKDIR /frontend

ENV PATH /frontend/node_modules/.bin:$PATH
COPY . /frontend

RUN npm install && npm run build

#----------------------
# Production NGINX
#----------------------
FROM nginx:1.16.0-alpine

COPY --from=builder /frontend/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf && mkdir /etc/nginx/ssl

COPY nginx/ssl/ /etc/nginx/ssl/
COPY nginx/nginx.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

