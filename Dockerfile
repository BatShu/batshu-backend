FROM node:16

WORKDIR /src

RUN apt-get update && apt-get install -y python3 python3-pip

COPY package*.json ./

COPY src/DashcamCleaner /src/DashcamCleaner

COPY . .

RUN npm install

CMD ["npm", "run", "serve"]

EXPOSE 3000



