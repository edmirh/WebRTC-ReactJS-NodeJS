FROM node:12.9-alpine

WORKDIR /backend

ENV PATH /backend/node_modules/.bin:$PATH

ADD package*.json ./
RUN npm install --silent

ADD . .

CMD ["npm", "start"]
