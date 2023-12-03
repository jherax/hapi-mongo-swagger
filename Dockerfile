# See following articles
# https://docs.docker.com/engine/reference/builder/
# https://dev.to/dariansampare/setting-up-docker-typescript-node-hot-reloading-code-changes-in-a-running-container-2b2f

# BASE STAGE
FROM node:20.10-alpine3.17 AS base

ARG dir=.
WORKDIR /app_built

COPY ${dir}/config ./config
COPY ${dir}/types ./types
COPY ${dir}/backend ./backend
COPY ${dir}/tsconfig.json .
COPY ${dir}/package.json .
# COPY ${dir}/.env .

RUN npm install

# PRODUCTION STAGE
FROM base AS prod

RUN npm run build-prd

#ENV NODE_PATH=./dist

#CMD ["node", "dist/index.js"]
