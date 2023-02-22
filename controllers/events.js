const Event= require('../models/eventsDB');
const mbxGeocoding=  require( '@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken= process.env.MAPBOX_TOKEN;
const geocoder= mbxGeocoding({accessToken: mapBoxToken})
const { cloudinary } = require('../cloudinary');

module.exports.index= async (req, res) => {
    const events = await Event.find({})
    res.render('events/index', { events })
}

module.exports.createEvent= async (req, res) => {
   
   
    const newPost = new Event(req.body.event);
    const geoData= await geocoder.forwardGeocode({
        query: req.body.event.location,
        limit: 1
      }).send();
    newPost.geometry= geoData.body.features[0].geometry;
    newPost.author= req.user._id
    newPost.image= req.files.map(f=> ({filename: f.filename, url: f.path}));
    await newPost.save();
    console.log(newPost)
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
    console.log(event)
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
    const imgs= req.files.map(f=> ({filename: f.filename, url: f.path}))
    event.image.push(...imgs );
    await event.save();
    console.log(event)
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