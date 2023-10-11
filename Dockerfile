# Use the official Python image as the base
FROM python:3.9-slim

RUN apt-get update && apt-get install -y gcc python3-dev nodejs npm

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && apt-get install -y nodejs

# 작업 디렉터리를 /src로 설정
WORKDIR /src

# 현재 디렉터리의 모든 파일을 컨테이너 내 /src 디렉터리로 복사
COPY . .

COPY src/DashcamCleaner /src/DashcamCleaner

RUN pip3 install --upgrade pip

# Python 패키지를 설치
RUN pip3 install -r requirements.txt

# Node.js 패키지를 설치
RUN npm install

# 앱 실행 명령
CMD ["npm", "run", "serve"]

# 포트 3000을 노출
EXPOSE 3000