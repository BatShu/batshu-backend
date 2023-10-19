FROM node:16

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "serve"]

EXPOSE 3000


# 시스템 종속성 설치 및 정리
#RUN apt-get update && apt-get install -y \
#    curl \
#    software-properties-common \
#    python3.6 \
#    python3-pip \
#    libgl1-mesa-glx \
#    && apt-get clean \
#    && rm -rf /var/lib/apt/lists/*


# COPY src/DashcamCleaner /src/DashcamCleaner
#RUN pip install --upgrade pip

# Python 패키지를 설치
#RUN pip install -r requirements.txt
#RUN apt-get install -y libgl1-mesa-glx

#RUN npm uninstall @ffmpeg-installer/ffmpeg --save
#RUN npm uninstall @ffprobe-installer/ffprobe --save
# 아래 패키지는 플랫폼 종속적이기에 자신의 플랫폼에 맞게 x64 혹은 arm64로 변경 필요
#RUN npm install @ffmpeg-installer/linux-arm64 --save --force
#RUN npm install @ffprobe-installer/linux-arm64 --save --force
#RUN npm run build

