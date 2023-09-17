FROM node:16-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY serviceAccountKey.json ./  

COPY . .

CMD ["npm", "run", "serve"]

EXPOSE 3000



