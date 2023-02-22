const mongoose = require('mongoose');
const { Schema } = mongoose;
const Comment = require('./commentsDB')

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts= { toJSON : { virtuals:true } }

const EventSchema = new Schema({
    title: String,
    image: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    content: String,

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, opts);


EventSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong> <a href='/events/${this._id}'>${this.title}</a><strong>
    <p >${this.location}</p>`
})

EventSchema.post('findOneAndDelete', async function (doc) {
    await Comment.remove({
        _id: {
            $in: doc.comments
        }
    })
})


module.exports = mongoose.model('Event', EventSchema);
