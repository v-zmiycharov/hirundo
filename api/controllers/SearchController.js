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

function findUser(name, res) {
	var regex = RegExp("/.*" + name + ".*/");
	var query = { username: new RegExp('^' + name) };
	User.find(query, function (err, users) {
		if (users.length == 0) {
          users = [];
        }

		return res.view('search/user', {
			searchWord: name,
			partial_name: 'user/peers',
			selected: 'users',
			data: {
			  users: users,
			  emptyMessage: 'Nobody found.'
			}
		});
	});
};

function findHashTags(tags, res) {
	async.map(tags, function(tag, callback){
		HashTag.findOne({text: tag}, function(err, tagFromDB) {
					callback(null, tagFromDB.id);
				})
	}, function (err, hashTagIds){
		Tweet.find({
			where: {
			  hashTags: hashTagIds
			}, sort: 'createdAt DESC'
		}).exec(function(err, tweets){
			async.map(tweets, function(tweet, callback){
				User.findOne({id: tweet.authorId}, function(err, user) {
					tweet.author = user;
					callback();
				})
			}, function(err) {
				HashTag.find({}, function (err, allHash) {
					async.map(allHash, function(hash, callback){
						callback(null, hash.text)
					}, function (err, allHashTags){
						return res.view('search/hash', {
							allHashTags: allHashTags,
							tags: tags,
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
	});
};

module.exports = {

  new: function(req, res, next) {
    var term = req.param('term');
    if (term[0] == '@') {
      findUser(term.replace('@', ''), res);
    } else if (term[0] == '#') {
      //findHashTags([term.replace('#', '')], res);
	  findHashTags(term.replace(/#/g, '').split(' '), res);
    } else {
      findUser(term, res);
	}
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
