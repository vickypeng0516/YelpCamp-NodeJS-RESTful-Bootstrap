var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

var campgrounds = [
    {name:"salmon creek", image: "https://visitreykjavik.is/sites/default/files/styles/whattodo_photo_600x450/public/campsite_reykjavik.jpg?itok=POovyC8J"},
    {name:"granite hill", image: "https://www.rei.com/content/dam/images/Expert%20Advice/Migration/HeroImages/Content_Team_081417_16668_Campsite_Selection_Backpackers_lg.jpg"},
    {name:"mountain goat", image: "http://src.onlinedown.net/supply/170210_logo/campsite.jpg"}
]

app.get("/", function(req,res){
    res.render("landing")
});
// show all camp ground
app.get("/campgrounds", function(req,res){
    res.render("campgrounds",{campgrounds : campgrounds});
});

// add a new camp grounds
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name, image:image}
    campgrounds.push(newCampground);
    // redirect to get request
    res.redirect("/campgrounds");
    // get data from form and add to campgrounds array
    // redirect back to campgrounds page

});
// show the form to display camp grounds 
app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
});
app.listen(3000, function(){
    console.log("yelp camp started");
});