FROM node:16.17.1-alpine

# set working directory
WORKDIR /app

# add /app/node_modules/.bin to $PATH
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV=production

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --only=production
#RUN npm install --silent

# add app
COPY . ./

# start app
# CMD ["npm","start"]
CMD [ "node", "server.js" ]

EXPOSE 9110