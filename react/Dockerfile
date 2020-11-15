FROM node:12.9-alpine as builder

WORKDIR /frontend

ENV PATH /frontend/node_modules/.bin:$PATH
ADD package*.json ./
RUN npm install --silent
ADD . .
RUN npm run build

#----------------------
# Production NGINX
#----------------------
FROM nginx:1.19-alpine

COPY --from=builder /frontend/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf && mkdir /etc/nginx/ssl

COPY nginx/ssl/ /etc/nginx/ssl/
COPY nginx/default.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

