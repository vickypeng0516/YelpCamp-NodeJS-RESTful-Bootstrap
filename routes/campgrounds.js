var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// show all camp ground
router.get("/campgrounds", function (req, res) {
    console.log(req.user);
    //Get all campground from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser : req.user
            });
        }
    });
});

// add a new camp grounds
router.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {
        name: name,
        image: image,
        description: desc
    }
    //Create a new campground and new to database
    Campground.create(newCampground, function (err, newlyCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// show the form to display camp grounds 
router.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new.ejs");
});

// get detailed camp
router.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;