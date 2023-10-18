FROM nikolaik/python-nodejs:python3.11-nodejs20-slim

RUN apt-get update && apt-get install -y \
    cwltool

RUN pip install cwlref-runner

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm install

COPY . .

CMD ["npm", "start"]
