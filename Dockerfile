FROM node:16-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

ENV DB_HOST = localhost \
    DB_USER = root \
    DB_PASS = tkfkdgo12! \
    DB_NAME = BatShu

CMD ["npm", "run", "serve"]

EXPOSE 3000


