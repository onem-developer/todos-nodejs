FROM node:10

#ARG service_src

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm set registry http://npm.dhq.onem
RUN npm install
RUN npm install nodemon -g
COPY . .
#COPY ${service_src} ./service/src
#COPY ./common ./common
#COPY ${service_src} .
CMD [ "npm", "run", "start" ]