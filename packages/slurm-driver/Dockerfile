FROM node:18-alpine as builder

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine

WORKDIR /usr/src/app
COPY config/default.js /usr/src/app/config/default.js
COPY --from=builder /app/dist .
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 7998

CMD [ "node", "." ]