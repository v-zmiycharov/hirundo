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
    var hashTags = values.content.match(/#([^\s]*)/g);

    if (!hashTags) {
      return next();
    }

  	async.map(hashTags, function(tag, callback) {
      var tagText = tag.replace('#', '');
  		HashTag.findOrCreate({text: tagText}, {text: tagText}, function(err, hashTag) {
			callback(null, hashTag.id);
		  });
  	}, function(err, hashTagIds) {
      if (err) {
        return next(err);
      }

      values.hashTags = hashTagIds;

      return next();
    });
  }
};
