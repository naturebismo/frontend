FROM node:6
EXPOSE 8080
RUN mkdir /app
VOLUME /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
CMD ["webpack-dev-server"]