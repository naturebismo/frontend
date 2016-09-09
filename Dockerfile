FROM node:6
EXPOSE 8080
RUN mkdir /app
COPY . /app
WORKDIR /app
ENV NODE_ENV development
RUN npm install
ENV PATH /app/node_modules/.bin:$PATH
ADD http://naturebismo.com/public/schema.json /app/schema.json

# We need to force production to build it.
RUN NODE_ENV=production npm run build

WORKDIR /app/build
CMD ["node", "server.js"]
