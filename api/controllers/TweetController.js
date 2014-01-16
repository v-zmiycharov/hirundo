/**
 * TweetController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
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

module.exports = {

  create: function(req, res, next) {
    var data = req.params.all();
    data.authorId = req.session.passport.user;

	data.hashTags = [];
	
	var regexp = new RegExp('#([^\\s]*)','g');
	var content = data.content;
	var temp;
	var hashTags = new Array();

	//do {
	//	temp = regexp.exec(content);
	//	if (temp) {
	//		hashTags.push(temp[1]);
	//	}
	//} while (temp);
	
	//hashTags.forEach(function(tag) {
	//	HashTag.findOne({text: tag}, function foundTag(err, tagFound) {
	//		if (err) {
	//			return next(err);
	//		}
	//		if (!tagFound) {
	//			return next();
	//		}
	//		else {
	//			data.hashTags.push(tagFound.id);
	//		}
	//	});
	//});

    Tweet.create(data, function(err, tweet) {
      if (err) {
        req.session.flash = {
          err: err
        }
      }

      return res.redirect('back');
    });
  }
};
