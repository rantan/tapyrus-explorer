FROM node:14.13.1-stretch

WORKDIR /app
COPY . .

RUN npm ci

EXPOSE 3001

ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "start"]


