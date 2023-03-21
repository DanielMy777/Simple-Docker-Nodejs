FROM node:18.14.0
WORKDIR /imageApp
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
RUN npm install -g nodemon

COPY . .
CMD [ "npm", "run", "start" ]