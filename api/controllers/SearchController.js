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
    var terms = req.param('term').split(',');
    var search = {
      tags: [],
      words: [],
      users: []
    };
    _.forEach(terms, function(term) {
      if (term[0] == '@') {
        search.users.push(term.substring(1));
      } else if (term[0] == '#') {
        search.tags.push(term.substring(1));
      } else {
        search.words.push(term);
      }
    });
    HashTag.find({text: search.tags}, function(err, hashTags) {
      async.map(hashTags, function(hashTag, callback) {
        callback(null, hashTag.id);
      }, function(err, hashTagIds) {
        Tweet.find({hashTags: hashTagIds}, function(err, tweets) {
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
              }
            });
          });
        });
      });
    });
  },

  hash: function(req, res, next) {
	var term = req.param('term');
    findHashTags([term], res);
  },

  multipleHash: function(req, res, next) {
	var term = req.param('term');
	if(typeof term === 'string') {
		term = [term];
	}
	findHashTags(term, res);
  },
};
