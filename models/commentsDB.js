const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    vote: Number,
    body: String,
   author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
   }
})

module.exports = mongoose.model('Comment', CommentSchema);