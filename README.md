# Reading Buddies

[![Build Status](https://travis-ci.org/cgmartin/ReadingBuddies.svg?branch=master)](https://travis-ci.org/cgmartin/ReadingBuddies)
[![Dependency Status](https://david-dm.org/cgmartin/ReadingBuddies.svg)](https://david-dm.org/cgmartin/ReadingBuddies)
[![devDependency Status](https://david-dm.org/cgmartin/ReadingBuddies/dev-status.svg)](https://david-dm.org/cgmartin/ReadingBuddies#info=devDependencies)

**Angular/Node.js/Gulp/Redis Example Demonstration**

A simple SPA and REST API demo that aggregates the book reviews of multiple Goodreads users.

The project is comprised of an Angular SPA, Express REST API, and Gulp build process.

```
  +-------------+
  |   Browser   |
  | Angular SPA |
  +------+------+
         |
 +-------+--------+   +-------------+
 | Express Server +---+ Redis Cache |
 +----------------+   +-------------+
         |
 +-------+--------+
 |  Goodreads API |
 +----------------+
```

## Screenshots

![Home page screenshot](./screenshots/home-page-screenshot.png?raw=true "Home page")

![Config page screenshot](./screenshots/config-page-screenshot.png?raw=true "Config page")

## Quick Start

Install and run the dependencies:

* Install [Node.js](https://nodejs.org/en/download/)
* Install and run [Redis](http://redis.io/topics/quickstart), or use the Redis [Docker](http://docs.docker.com/) image: `docker-compose up -d redis`

Configure the application:

1. Request a [Goodreads API Developer Key](https://www.goodreads.com/api/keys)
1. Copy `.env.example` to `.env`
1. Modify `.env` with correct configuration values

Build and run the application:

1. Run `npm install && bower install` to install the app dependencies
1. Run `npm run build` to build the app JS/CSS bundles and static files folder (`./build/`)
1. Run `npm start` to start the http server
1. Open browser: <http://localhost:8000>

To build a Docker image of the app:

1. Build the app: `npm run build`
1. Build the image: `docker-compose build web`
1. Run the container: `docker-compose up -d web`

## Contributing

1. Fork and clone it
1. Install dependencies: `npm install`
1. Create a feature branch: `git checkout -b new-feature`
1. Commit changes: `git commit -am 'Added a feature'`
1. Run static code analysis and unit tests: `npm test`
1. Push to the remote branch: `git push origin new-feature`
1. Create a new Pull Request

Build/refresh upon file changes:

1. Run `npm run develop` for development mode
1. Open browser: <http://localhost:3000>


## License ##

[MIT License](http://cgm.mit-license.org/)  Copyright © 2014 Christopher Martin


