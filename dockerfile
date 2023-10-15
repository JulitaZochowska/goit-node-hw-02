FROM node:18.18.0-alpine

ENV PORT 4200

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

ADD . /app/

EXPOSE 4200

CMD ["node", "server.js"]

# Najpierw build:
# docker build -t jwt-project .

# Potem można sprawdzić, że istnieje:
# docker images

# Ostatecznie uruchomić:
# docker run -p 4200:4200 jwt-project 