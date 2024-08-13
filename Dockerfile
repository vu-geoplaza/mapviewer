FROM node:lts-alpine AS build-stage
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

FROM nginxinc/nginx-unprivileged AS production-stage
ARG BUILD_ENV

RUN chmod -R 777 /var/cache/nginx

WORKDIR /usr/share/nginx/html
COPY --from=build-stage /app/dist/${BUILD_ENV}/. .
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]