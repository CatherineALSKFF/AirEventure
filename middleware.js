
const {eventSchema, commentSchema}= require('./schemas');
const ExpressError= require('./utils/expressError')
const Event = require('./models/eventsDB')
const Comment= require('./models/commentsDB')

module.exports.validateEvent= (req,res,next)=>{
    const {error}= eventSchema.validate(req.body);
console.log(error)
if(error){
    const msg= error.details.map(el=>el.message).join(',')
    throw new ExpressError(msg, 400)
}else{
 
    next();
   }
}



module.exports.validateComment=async(req,res,next)=>{
    const {error}= commentSchema.validate(req.body);
if (error){
    const msg= error.details.map(el=>el.message).join(',')
     throw new ExpressError(msg, 400) 
}else {
    next();
}};


module.exports.isLoggedIn = (req, res ,next)=>{
    if (!req.isAuthenticated()){
req.session.returnTo= req.originalUrl
  
        req.flash('error', 'You must be signed in ');
  return  res.redirect('/login')
}
next();
}

module.exports.isAuthor= async(req,res,next)=>{
    const {id}=req.params;
    const event= await Event.findById(id);
    if (!event.author.equals(req.user._id)){
        req.flash('error', 'You do not have the permission to do that!');
        res.redirect(`/events/${id}`)
    }
  next();
  }
  
  module.exports.isCommentAuthor= async(req,res,next)=>{
    const {id,commentId}=req.params;
    const event= await Comment.findById(commentId);
    if (!event.author.equals(req.user._id)){
        req.flash('error', 'You do not have the permission to do that!');
        res.redirect(`/campgrounds/${id}`)
    }
  next();
  }


  
// module.exports.isEvAuthor= async(req,res,next)=>{
//     const {id}=req.params;
//     const event= await Event.findById(id);
//     if (!event.author._id ==='63e7784c9e0fba5455e1850f'){
//         req.flash('error', 'You do not have the permission to do that!');
//         res.redirect(`/events`)
//     }
//   next();
//   }
  