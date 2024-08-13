FROM node:lts-alpine as build-stage
ARG BUILD_ENV=gpz

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build:${BUILD_ENV}

FROM nginx:stable-alpine as production-stage
ARG BUILD_ENV

RUN chmod -R 777 /var/cache/nginx

WORKDIR /usr/share/nginx/html
COPY --from=build-stage /app/dist/${BUILD_ENV}/. .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]