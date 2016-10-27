FROM node:6

ENV DEBIAN_FRONTEND noninteractive

# set backend server locale to pt_BR since it's our primary language
# thus react's server side rendered pages are rendered using pt_BR dates
RUN apt-get update -qq && apt-get install -y locales -qq
RUN echo "pt_BR.UTF-8 UTF-8" >> /etc/locale.gen
RUN echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
RUN locale-gen
RUN dpkg-reconfigure locales
ENV LC_ALL=pt_BR.UTF-8
ENV LANG=pt_BR.UTF-8
ENV LANGUAGE=pt_BR.UTF-8
ENV LC_CTYPE=pt_BR.UTF-8
ENV LC_COLLATE=pt_BR.UTF-8

ENV NODE_ENV development

RUN git clone --branch multiple-files-upload --quiet https://github.com/nossila/relay.git
WORKDIR ~/relay
RUN npm run build

EXPOSE 8080
RUN mkdir /app
COPY . /app
WORKDIR /app
RUN npm install ~/relay
ENV PATH /app/node_modules/.bin:$PATH
ADD http://naturebismo.com/public/schema.json /app/schema.json

# We need to force production to build it.
RUN NODE_ENV=production npm run build

WORKDIR /app/build
CMD ["node", "server.js"]
