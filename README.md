# hirundo

[![Build Status](https://travis-ci.org/s2gatev/hirundo.png?branch=master)](https://travis-ci.org/s2gatev/hirundo)
[![Dependency Status](https://gemnasium.com/s2gatev/hirundo.png)](https://gemnasium.com/s2gatev/hirundo)

Twitter clone written in Node using Sails.js. This is a university course project so it probably won't be of much interest to you. Anyways..

## Requirements
* NodeJs v0.10
* Mongo

## Development setup
1. Clone the repository
2. Execute `npm install` to install all dependencies
3. Start the mongo server with `mongod`
4. Run the app using `sails lift`

## Running the tests
You can run the tests with `npm test`. This will execute the unit tests located under `/test` as well as the feature tests located under `/features`.

## Backlog
Some features that need to be implemented:

#### University
* Refactor html
* Validation messages for: Registration, login, Edit profile, add message (Max length)
* User photos - Stanislav
* View max 50 messages and refresh tweets in 30 seconds - Stanislav
* Search for multiple hashtags - Valentin
* Script for generating fake data - Valentin

#### Core
* Tweet replies
* Retweets
* Favorite tweets

#### Goodies
* Live tweet feed (using socket.io)
* Messaging - private messaging between the users (using socket.io)
* Search - searching for users and hashtags
* Use Mongo associations in model relations (requires v0.10 of Sails)
