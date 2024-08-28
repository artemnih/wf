FROM node:20-alpine as builder

WORKDIR /app

COPY . .

RUN npm i --w=packages/common
RUN npm i --w=packages/slurm-driver

RUN npm run build:common
RUN npm run build:slurm

FROM node:20-alpine

WORKDIR /usr/src/app
COPY --from=builder /app/packages/slrum-driver/dist .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/common/dist ./node_modules/@polusai/compute-common
COPY --from=builder /app/packages/slurm-driver/config ./config
EXPOSE 7998

CMD [ "node", "." ]