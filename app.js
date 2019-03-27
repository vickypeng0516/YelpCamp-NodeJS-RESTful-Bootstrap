var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var User = require("./models/user");
var LocalStrategy = require("passport-local");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index.js");

//search database named as yelp_camp, if exist connect, if not create
mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));


var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
// seedDB();

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

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "root",
    resave: false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
//User.authenticate, serializeUser(), deserializeUser() is the method come from password-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// to make var available in entire routes
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(3000, function () {
    console.log("yelp camp started");
});