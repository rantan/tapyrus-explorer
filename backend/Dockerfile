FROM node:14.13.1-stretch

ENV CONF_DIR='/app/configurations'

WORKDIR /app
COPY . .

RUN npm install && \
    mkdir $CONF_DIR

EXPOSE 3001

ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "start"]


