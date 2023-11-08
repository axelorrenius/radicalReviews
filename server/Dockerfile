FROM public.ecr.aws/docker/library/node:18

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY .env ./

RUN ls -a
RUN npm install
RUN npm run build
COPY src/static ./dist/static

EXPOSE 8080
CMD ["npm", "run", "start"]
