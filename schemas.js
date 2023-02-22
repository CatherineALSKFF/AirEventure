
const Joi= require('joi');


module.exports.eventSchema=  Joi.object({
    event: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location:Joi.string().required(),
        content: Joi.string().required()
    }).required()
});

module.exports.commentSchema= Joi.object({
    comment: Joi.object({
        vote: Joi.number().required().min(0).max(5),
        body: Joi.string().required()
    }).required()
})