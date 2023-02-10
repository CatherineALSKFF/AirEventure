const mongoose= require('mongoose');
const {Schema}= mongoose;
const Comment= require('./commentsDB')


const EventSchema= new Schema({
    title: String,
    description: String,
    content: String,
author: {
   type: Schema.Types.ObjectId, 
   ref: 'User'
},
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

EventSchema.post('findOneAndDelete', async function(doc){
    await Comment.remove({
        _id: {
            $in:doc.comments
        }
    })})
     

module.exports= mongoose.model('Event', EventSchema);
