FROM node:14.13.1-stretch

WORKDIR /app
COPY . .

RUN npm install && \
    npm install -g @angular/cli@9.1.13

EXPOSE 4200

ENTRYPOINT ["./entrypoint.sh"]
CMD ["ng", "serve", "--host 0.0.0.0"]
