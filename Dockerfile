# base image
FROM node:9.6.1 as react-build

# set working directory
WORKDIR /app

COPY . ./

# install and cache app dependencies
RUN yarn
RUN yarn build

# start app
FROM nginx:alpine
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]