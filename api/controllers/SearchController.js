/**
 * SearchController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var _ = require("lodash");

module.exports = {

  new: function(req, res, next) {
    var terms = req.param('term').replace(/ /g, '').split(',');
    var query = "";
    var search = {
      tags: [],
      users: []
    };
    _.forEach(terms, function(term) {
      query += '&';
      if (term[0] == '@') {
        query += 'user:' + term.substring(1);
      } else if (term[0] == '#') {
        query += 'hash:' + term.substring(1);
      }
    });
    return res.redirect('/search/' + query.substring(1));
  },

  query: function(req, res, next) {
    var terms = req.param('terms').split('&');
    var query = terms.join(',').replace(/user:/g, '@').replace(/hash:/g, '#').replace(/ /g, '');
    var search = {
      tags: [],
      users: []
    };
    _.forEach(terms, function(term) {
      var item = term.split(':');
      if (item[0] == 'user') {
        search.users.push(item[1]);
      } else if (item[0] == 'hash') {
        search.tags.push(item[1]);
      }
    });
    HashTag.find({text: search.tags}, function(err, hashTags) {
      async.map(hashTags, function(hashTag, callback) {
        callback(null, hashTag.id);
      }, function(err, hashTagIds) {
        User.find({username: search.users}, function(err, users) {
          async.map(users, function(user, callback) {
            callback(null, user.id);
          }, function(err, userIds) {
            var criteria = {};
            if (hashTagIds.length > 0) {
              criteria.hashTags = hashTagIds;
            }
            if (userIds.length > 0) {
              criteria.mentions = userIds;
            }
            Tweet.find(criteria, function(err, tweets) {
              async.map(tweets, function(tweet, callback) {
                User.findOne({id: tweet.authorId}, function(err, user) {
                  tweet.author = user;
                  callback(null, tweet);
                });
              }, function(err, tweets) {
                return res.view('search/hash', {
                  partial_name: 'tweet/index',
                  selected: 'tweets',
                  data: {
                    tweets: tweets,
                    emptyMessage: 'No tweets found.'
                  },
                  search_items: query
                });
              });
            });
          });
        });
      });
    });
  }
};
