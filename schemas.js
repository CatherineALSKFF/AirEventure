
const BaseJoi= require('joi');

const sanitizeHtml= require('sanitize-html')


const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        string: '{{#label}} Should not contain any html tags.',
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean == !value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
})


const Joi = BaseJoi.extend(extension)


module.exports.eventSchema=  Joi.object({
    event: Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        location:Joi.string().required().escapeHTML(),
        content: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.commentSchema= Joi.object({
    comment: Joi.object({
        vote: Joi.number().required().min(0).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})