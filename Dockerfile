FROM node:16-alpine

WORKDIR /src

COPY package*.json ./
COPY .env ./

RUN npm install

COPY . .

CMD ["npm", "run", "serve"]

EXPOSE 3000


