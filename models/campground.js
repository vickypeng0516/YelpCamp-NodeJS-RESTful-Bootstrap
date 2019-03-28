// SCHEMA SETUP
var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description:String,
    location: String,
    price: String,
    // ARRAY, to add and associate, use .push()
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author : {
        id:{ 
            type: mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username: String
    }
});

var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;