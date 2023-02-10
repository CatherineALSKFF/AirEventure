const express = require('express');
const router = express.Router();
const Event = require('../models/eventsDB');
const Comment = require('../models/commentsDB');
const comments= require('../controllers/comments')
const catchAsync = require('../utils/catchAsync');
const { validateComment, isLoggedIn , isCommentAuthor} = require('../middleware')


router.post('/events/:id/comments', isLoggedIn, validateComment, catchAsync(comments.createComment))


router.delete('/events/:id/comments/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment))

module.exports = router;


