var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//search database named as yelp_camp, if exist connect, if not create
mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
seedDB();

// FOR STARTER DATA
// Campground.create({
//         name: "Granite Hill",
//         image:"http://src.onlinedown.net/supply/170210_logo/campsite.jpg" ,
//         description : "This is granite hill decription."
//     }, function(err, campground){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(campground);
//     }
// });
// !! TEST MONGOOSE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// var catSchema = new mongoose.Schema({
//     name: String,
//     age: Number,
//     temperament: String
// });
// schema complie to model
// var Cat = mongoose.model("Cat",catSchema);

// var george = new Cat({
//     name: "George",
//     age: 11,
//     temperament: "Grouchy"
// });
// CALL BACK EXAMPLE save
// george.save(function(err, cat){
//     if(err){
//         console.log("Something is wrong!");
//     }else{
//         console.log("Cat saved" + cat);
//     }
// });

// retrive data
// Cat.find({}, function(err, cats){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(cats);
//     }
// });

// add
// Cat.create({
//     name : "Snow White",
//     age: 15,
//     temperament : "Nice"
// }, function(err, cat){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(cat);
//     }
// });
// !! TEST MONGOOSE END !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// var campgrounds = [
//     {name:"salmon creek", image: "https://visitreykjavik.is/sites/default/files/styles/whattodo_photo_600x450/public/campsite_reykjavik.jpg?itok=POovyC8J"},
//     {name:"granite hill", image: "https://www.rei.com/content/dam/images/Expert%20Advice/Migration/HeroImages/Content_Team_081417_16668_Campsite_Selection_Backpackers_lg.jpg"},
//     {name:"mountain goat", image: "http://src.onlinedown.net/supply/170210_logo/campsite.jpg"}
// ]

app.get("/", function (req, res) {
    res.render("landing")
});
// show all camp ground
app.get("/campgrounds", function (req, res) {
    //Get all campground from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds
            });
        }
    });
});

// add a new camp grounds
app.post("/campgrounds", function (req, res) {
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
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new.ejs");
});

// get detailed camp
app.get("/campgrounds/:id", function (req, res) {
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
// lead to add comment form
app.get("/campgrounds/:id/comments/new", function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:foundCampground});
        }
    }); 
});

// post new comment
app.post("/campgrounds/:id/comments", function(req,res){
    // look up campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    ///campgrounds/:id
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
    // create new comment
    // connect new comment to campground
    // redirect
});

app.listen(3000, function () {
    console.log("yelp camp started");
});