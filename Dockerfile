FROM node:6
EXPOSE 8080
RUN mkdir /app
COPY . /app
WORKDIR /app
ENV NODE_ENV development
RUN npm install
ENV PATH /app/node_modules/.bin:$PATH
RUN mkdir /app/build
VOLUME /app
VOLUME /app/build
RUN wget http://naturebismo.com/public/schema.json
RUN npm_lifecycle_event=build NODE_ENV=production webpack -p
RUN chmod +x /app/docker-entrypoint.sh
CMD ["/app/docker-entrypoint.sh"]