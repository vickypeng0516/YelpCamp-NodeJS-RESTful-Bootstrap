var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
// ROUTE
router.get("/", function (req, res) {
    res.render("landing");
});


// Auth route
// go to register page
router.get("/register", function(req,res){
    res.render("register");
});

// handle register form
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register"); 
        }
        passport.authenticate("local")(req,res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req,res){
    res.render("login");
})

// handle login logic
// passport.authenticate is the middleware
router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }), function(req,res){
});

// Add logout is provided in passport js
// METHOD .logout()
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "You Are Logged Out!");
    res.redirect("/campgrounds");
}); 

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;