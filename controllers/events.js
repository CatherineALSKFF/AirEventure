const Event= require('../models/eventsDB');


module.exports.index= async (req, res) => {
    const events = await Event.find({})
    res.render('events/index', { events })
}

module.exports.createEvent= async (req, res) => {
    console.log(req.body.event)
    const newPost = new Event(req.body.event);
    newPost.author= req.user._id
    await newPost.save();
    req.flash('success', 'Event Posted')
    res.redirect(`events/${newPost.id}`)
}

module.exports.renderNewForm=(req, res) => {
    res.render('events/new')
}

module.exports.showEvent=async (req, res) => {
    const event = await Event.findById(req.params.id).populate({
      path: 'comments',
      populate: {path: 'author'}
    }).populate('author')
    console.log(event.author)
    if (event) {
        res.render('events/show', { event })
    } else {
        req.flash('error', 'This event Doesnt exist');
        res.redirect('/events')
    }
}

module.exports.editEvent=async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, { ...req.body.event })
    req.flash('success', 'Your Event is successfully edited')
    res.redirect(`/events/${event._id}`)
}

module.exports.deleteEvent=async (req, res) => {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    req.flash('success', 'Your event is successfully deleted');
    res.redirect('/events');
}

module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id)
    if (!event) {
        req.flash('error', 'This event Doesnt exist');
        res.redirect('/events')
    }
    res.render('events/edit', { event });
}