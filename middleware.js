const Listing = require("./models/listing");
const Review = require("./models/review");

const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You Have To Login For This.")
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    if (!res.locals.currUser) {
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    if(!listing.owner._id.equals(res.locals.currUser._id))
    {
        req.flash("error","You Don't Have Permission.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = async(req,res,next) =>{
    console.log("Before Fix:", req.body);

    if (!req.body.listing) {
        req.body.listing = {};
    }
    if(req.file == undefined)
    {
        let obj = await Listing.findOne({title:req.body.listing.title});
        req.body.listing.image = {
            url: obj.image.url,
            filename: obj.image.filename
        };
    }
    // console.log(req.file);
    // Manually add image if it's uploaded
    if (req.file !== undefined) {
        req.body.listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    if (req.user) {
        req.body.listing.owner = req.user._id.toString();
    }
    // console.log(req.body);
    console.log("After Fix:", req.body);
    let {error}  = listingSchema.validate(req.body);
    if(error)
    {
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
};

module.exports.validateReview = (req,res,next) =>{
    let {error}  = reviewSchema.validate(req.body);
    if(error)
    {
        let errorMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errorMsg);
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(currUser && !review.author._id.equals(res.locals.currUser._id))
    {
        req.flash("error","You Don't Have Permission.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};