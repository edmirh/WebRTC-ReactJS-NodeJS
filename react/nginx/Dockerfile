FROM nginx:1.16.0-alpine

RUN rm /etc/nginx/conf.d/default.conf && mkdir /etc/nginx/ssl

COPY ./ssl/ /etc/nginx/ssl/
COPY ./nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

