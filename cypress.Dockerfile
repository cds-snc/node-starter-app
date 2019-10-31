FROM cypress/included:3.5.0
ADD ./ /web

WORKDIR /web
RUN mkdir -p ~/cypress
COPY package.json .
COPY package-lock.json .
# by setting CI environment variable we switch the Cypress install messages
# to small "started / finished" and avoid 1000s of lines of progress messages
ENV CI=1
RUN npm install --save-dev cypress-axe axe-core

# verify that cypress has been installed correctly
RUN npx cypress verify

COPY cypress ./cypress
COPY cypress.json .