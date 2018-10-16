# base image
FROM node:9.6.1 as react-build

# set working directory
WORKDIR /app

COPY . ./

# install and cache app dependencies
RUN yarn
RUN yarn build

CMD ["npm", "start"]