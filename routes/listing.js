const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });

// //Index Route
// router.get("/",wrapAsync(listingController.index));
// //Create Route
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));



// New Route
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));


// //Show Route
// router.get("/:id", wrapAsync(listingController.showListings));
// //Update route
// router.put("/:id" ,isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));
// //Delete Route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync());

router.route("/:id")
.get( wrapAsync(listingController.showListings))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));



module.exports = router;
