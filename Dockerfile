FROM node:16-alpine

# 시스템 종속성 설치 및 정리
#RUN apt-get update && apt-get install -y \
#    curl \
#    software-properties-common \
#    python3.6 \
#    python3-pip \
#    libgl1-mesa-glx \
#    && apt-get clean \
#    && rm -rf /var/lib/apt/lists/*

# 작업 디렉터리를 /src로 설정
WORKDIR /src

# 현재 디렉터리의 모든 파일을 컨테이너 내 /src 디렉터리로 복사
COPY . .

# COPY src/DashcamCleaner /src/DashcamCleaner
#RUN pip install --upgrade pip

# Python 패키지를 설치
#RUN pip install -r requirements.txt
#RUN apt-get install -y libgl1-mesa-glx

#RUN npm install -g npm@10.2.0
#RUN npm uninstall @ffmpeg-installer/ffmpeg --save
#RUN npm uninstall @ffprobe-installer/ffprobe --save
# 아래 패키지는 플랫폼 종속적이기에 자신의 플랫폼에 맞게 x64 혹은 arm64로 변경 필요
RUN npm install
#RUN npm install @ffmpeg-installer/linux-arm64 --save --force 
#RUN npm install @ffprobe-installer/linux-arm64 --save --force
#RUN npm run build

# 앱 실행 명령
CMD ["npm", "run", "serve"]
# 포트 3000을 노출
EXPOSE 3000