//import npm modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
// const seedDB = require('./data');
//import models
const Resource = require("./models/resource");
const Comment = require("./models/comment");
const User = require('./models/user');
//import routes
const resourceRoutes = require('./routes/resources');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');

//connect to the database
mongoose.connect('mongodb://localhost:27017/assessr');
// seedDB();
//middleware
app.set("view engine", "ejs");
//serve static files
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({
    extended: true
}));
// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "The earth is flat",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//make the user object globally available
app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});

app.use(indexRoutes);
app.use('/resources', resourceRoutes);
app.use('/resources/:id/comments', commentRoutes);


app.listen(3000 || process.env.PORT, () => console.log("AssessR is up and running"));

