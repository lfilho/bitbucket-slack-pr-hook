FROM ubuntu:14.04
ENV PORT 5000
EXPOSE 5000
ENV PATH ./node_modules/gulp/bin:$PATH
ENV NODE_ENV development

# Install apps and dependencies
RUN apt-get update
RUN apt-get install -y nodejs npm git
RUN ln -s /usr/bin/nodejs /usr/bin/node

# Run app as a custom user `app`
WORKDIR /app
RUN useradd -m -d /app app
# Run install first to cache the step
ADD package.json /app/package.json
RUN npm install
ADD . /app

RUN chown -R app.app /app

USER app
ENV HOME /app

# Default command to run service
ENV NODE_ENV production
CMD npm start
