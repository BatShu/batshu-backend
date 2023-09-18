FROM node:16-alpine

# ⭐ 'ARG' 예약어를 통해 인자로 전달 받아야 한다.
ARG PROJECT_ID \
    PRIVATE_KEY_ID \
    CLIENT_EMAIL


# ⭐ 'ENV' 예약어를 통해 전달받은 값을 실제 값과 매칭시켜야 한다.
ENV PRIVATE_KEY_ID=${PRIVATE_KEY_ID} \
    PRIVATE_KEY_ID=${PRIVATE_KEY_ID} \
    CLIENT_EMAIL=${CLIENT_EMAIL} 


WORKDIR /src

COPY package*.json ./

RUN npm install


COPY . .

CMD ["npm", "run", "serve"]

EXPOSE 3000



