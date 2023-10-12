FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    curl \
    software-properties-common \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV LANG C.UTF-8

# PPA를 추가하고 Python 3.7 설치
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get update && apt-get install -y \
    python3.6 \
    python3-pip \
    libgl1-mesa-glx

# Node.js 설치
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs


# 작업 디렉터리를 /src로 설정
WORKDIR /src

# 현재 디렉터리의 모든 파일을 컨테이너 내 /src 디렉터리로 복사
COPY . .

# COPY src/DashcamCleaner /src/DashcamCleaner
RUN pip install --upgrade pip

# Python 패키지를 설치
RUN pip install -r requirements.txt
RUN apt-get install -y libgl1-mesa-glx

# Node.js 패키지를 설치
RUN npm install

# 앱 실행 명령
CMD ["npm", "run", "serve"]

# 포트 3000을 노출
EXPOSE 3000