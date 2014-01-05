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

    autor: function(callback) {
      User.findOneById(this.authorId, function(err, user) {
        if (err) {
          return callback(err);
        }

        if ( ! user) {
          return callback();
        }

        return callback(null, user);
      });
    }
  }
};
