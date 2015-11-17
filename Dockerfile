FROM node:4.2-slim

EXPOSE 8000
ENV NODE_ENV production
CMD npm start

RUN mkdir -p /app/src
WORKDIR /app

COPY package.json /app/package.json
RUN npm install

COPY src/server /app/src/server
COPY build /app/build

# 1. `npm run build`
# 2. `docker-compose build`
# 3. `docker-compose up -d`
# 4. open browser: "http://{Docker Machine IP}:8000"
