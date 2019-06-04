require('dotenv').config()
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
var methodOverride = require("method-override");
var flash = require("connect-flash");

//search database named as yelp_camp, if exist connect, if not create

mongoose.connect('mongodb+srv://root:root@cluster0-cd5zp.mongodb.net/test?retryWrites=true', {
    useNewUrlParser: true
});
//mongodb://localhost/yelp_camp
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


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
// to call use currentUser.attr in ejs
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(process.env.PORT||3000, function () {
    console.log("yelp camp started");
});