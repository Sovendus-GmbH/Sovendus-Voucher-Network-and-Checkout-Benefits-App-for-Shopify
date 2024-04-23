FROM node:18-alpine

EXPOSE 3000
WORKDIR /app
COPY . .

ENV NODE_ENV=production
RUN npm install
RUN npm run build

VOLUME /app/prisma/db


CMD ["npm", "run", "start"]
