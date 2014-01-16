/**
 * Tweet
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {

    authorId: {
      type: 'string',
      required: true
    },

    content: {
      type: 'string',
      maxLength: 140,
      required: true
    },

    location: {
      type: 'string',
      maxLength: 100,
      required: false
    },
	
	hashTags: {
      type: 'array',
      defaultsTo: []
	},

    autor: function(callback) {
      User.findOneById(this.authorId, function(err, user) {
        if (err) {
          return callback(err);
        }

        if (!user) {
          return callback();
        }

        return callback(null, user);
      });
    }
  },
  
  beforeCreate: function(values, next) {  
	var regexp = new RegExp('#([^\\s]*)','g');
	var content = values.content;
	var temp;
	var hashTags = new Array();

	do {
		temp = regexp.exec(content);
		if (temp) {
			hashTags.push(temp[1]);
		}
	} while (temp);
	
	hashTags.forEach(function(tag) {
		HashTag.findOne({text: tag}, function foundTag(err, tagFound) {
			if (err) {
				return next(err);
			}
			if (!tagFound) {
				HashTag.create({text: tag}, function createdTag(err, tagCreated) {
					if (err) {
						return next(err);
					}

					if (!tagCreated) {
						return next();
					}
				});
			}
		});
	});

    return next();
  }
};
