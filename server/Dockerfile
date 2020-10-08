FROM node:14.11-slim

WORKDIR /backend

ENV PATH /backend/node_modules/.bin:$PATH
COPY . /backend

RUN npm install
CMD ["npm", "start"]



