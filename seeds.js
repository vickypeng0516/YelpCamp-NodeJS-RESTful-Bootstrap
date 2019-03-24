var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [{
        name: "Clouds'rest",
        image: "http://src.onlinedown.net/supply/170210_logo/campsite.jpg",
        description: "blan blan ......"
    },
    {
        name: "Clouds'rest",
        image: "http://src.onlinedown.net/supply/170210_logo/campsite.jpg",
        description: "blan blan ......"
    },
    {
        name: "Clouds'rest",
        image: "http://src.onlinedown.net/supply/170210_logo/campsite.jpg",
        description: "blan blan ......"
    },
];

// CALLBACK HELL EXAMPLE, NEED REFACTOR 
function seedDB() {
    // remove all campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed campgrounds");
            // add new campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added campground");
                        // create a comment
                        Comment.create({
                            text: "This is place is greate",
                            author: "Homer"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err)
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment")
                            }
                        });
                    }
                });
            });
        }
    });
}

// send function out
module.exports = seedDB;