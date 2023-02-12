const express = require('express');
const router = express.Router();
const events= require('../controllers/events')
const Event = require('../models/eventsDB');
const catchAsync = require('../utils/catchAsync')
const { validateEvent, isLoggedIn, isAuthor } = require('../middleware')



router.route('/')

.get(catchAsync(events.index))

.post( isLoggedIn, validateEvent, catchAsync(events.createEvent))



router.get('/new', isLoggedIn, events.renderNewForm)



router.route('/:id')
.get( catchAsync(events.showEvent))
.put( validateEvent, isAuthor,  catchAsync(events.editEvent))
.delete( isLoggedIn, isAuthor, catchAsync(events.deleteEvent))



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(events.renderEditForm))















module.exports = router;