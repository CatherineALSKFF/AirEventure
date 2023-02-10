const Event = require('../models/eventsDB');
const Comment = require('../models/commentsDB');


module.exports.createComment= async (req, res) => {
    const event = await Event.findById(req.params.id)
    const comment = new Comment(req.body.comment);
    comment.author= req.user._id;
    event.comments.push(comment);
    await comment.save();
    await event.save();
    console.log(event)
    req.flash('success','Comment added')
    res.redirect(`/events/${event._id}`)
};

module.exports.deleteComment= async (req, res) => {
    const { id, commentId } = req.params;
    await Event.findByIdAndUpdate(id, { $pull: { comments: commentId } })
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted comment')
    res.redirect(`/events/${id}`)
    console.log(id)
}