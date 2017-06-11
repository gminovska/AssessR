const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//set up the routes 
router.get("/", (req, res) => {
    res.redirect("/resources");
});

//====================
//  AUTH ROUTES
//====================
//show sign up form
router.get('/register', (req, res) => {
    res.render('register');
});
//handle sign up logic
router.post('/register', function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', "Welcome, " + user.username);
            res.redirect('/resources');
        });
    });
});

//show login form
router.get('/login', function (req, res) {
    res.render('login');
});
//handle login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/resources',
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {});

//logout route
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/resources');
});

//my middleware functions
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect('/login');
}

module.exports = router;