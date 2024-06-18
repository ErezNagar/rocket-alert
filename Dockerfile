FROM node:14

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN npm install

CMD ["npm", "start"]
EXPOSE 3000/tcp