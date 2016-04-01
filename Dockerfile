FROM node:4.2-slim

EXPOSE 8000
ENV NODE_ENV production
CMD npm start

RUN mkdir -p /app/src
WORKDIR /app

COPY package.json /app/package.json
RUN npm install

COPY server /app/server
COPY build /app/build

# 1. `npm run build`
# 2. `docker-compose build`
# 3. `docker-compose up -d`
# 4. `open http://$(docker-machine ip):8000`
