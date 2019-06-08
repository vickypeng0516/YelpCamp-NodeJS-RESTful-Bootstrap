var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);
// show all camp ground
router.get("/campgrounds", function (req, res) {
    //Get all campground from DB
    console.log("Show All Campground");
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser: req.user
            });
        }
    });
});
// search campground
router.post("/campgrounds/search", function (req, res) {
    var name = req.body.name;
    var loc = req.body.location;
    console.log(loc);
    if (!loc) {
        Campground.find({
            'name': name
        }, function (err, foundCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {
                    campgrounds: foundCampgrounds,
                    currentUser: req.user
                });
            }
        });
    } else if (!name) {
        Campground.find({
            'location': loc
        }, function (err, foundCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {
                    campgrounds: foundCampgrounds,
                    currentUser: req.user
                });
            }
        });
    } else {
        Campground.find({
            'location': loc,
            'name': name
        }, function (err, foundCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {
                    campgrounds: foundCampgrounds,
                    currentUser: req.user
                });
            }
        });
    }
});

// add a new camp grounds
router.post("/campgrounds", isLoggedIn, function (req, res) {
    console.log("add new camp grounds");
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var user_id = req.user._id;
    var username = req.user.username;
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('err', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCampground = {
            name: name,
            image: image,
            description: desc,
            location: location,
            lat: lat,
            lng: lng,
            price: price,
            author: {
                id: user_id,
                username: username
            }
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
});

// show the form to display camp grounds 
router.get("/campgrounds/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new.ejs");
});

// get detailed camp
router.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    });
});

// Edit Campground route
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", {
            campground: foundCampground
        });
    });
});

// Update Campground route
router.put("/campgrounds/:id/edit", checkCampgroundOwnership, function (req, res) {
    geocoder.geocode(req.body.campground.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
    
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
      });
});

//Destroy campground route
router.delete("/campgrounds/:id", checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    //.flash(key, message);
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
    // is user logged in 
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the campground?
                // check if the id of author in the campground matches the current user
                // mongoose object
                // console.log(foundCampground.author.id);
                // string
                // console.log(req.user._id);
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;