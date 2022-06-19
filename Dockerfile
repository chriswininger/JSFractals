FROM node:17-alpine3.15
ADD ./ /JSFractals
WORKDIR /JSFractals
RUN npm install

ENTRYPOINT npm run start
