FROM node:14-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

RUN npm install -g nodemon

COPY ./public/package*.json ./

RUN apk add -U --no-cache --allow-untrusted udev ttf-freefont chromium git
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

USER node

RUN npm install

COPY --chown=node:node ./public .

EXPOSE 8080

CMD ["nodemon", "app.js"]