var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  content: { type: String, required: true },
  timestamp: { type: String, required: true },
  author: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
});

module.exports = mongoose.model('Comment', CommentSchema);
