const Joi = require('joi');
const review = require('./models/review');

module.exports.listingSchema =  Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().uri().required(),
            filename: Joi.string().required()
        }).required(),
        reviews: Joi.array().items(Joi.string().hex().length(24)), 
        owner: Joi.string().hex().length(24).required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});