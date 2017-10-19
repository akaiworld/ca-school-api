FROM node:boron
RUN mkdir /ca-school-app
WORKDIR /ca-school-app
COPY . /ca-school-app
RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]