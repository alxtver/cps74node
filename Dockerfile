FROM node:12-alpine
WORKDIR /cps74node
COPY . .
RUN yarn install --production
CMD ["node", "index.js"]