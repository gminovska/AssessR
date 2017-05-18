//import npm modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
// const seedDB = require('./data');
//import models
const Resource = require("./models/resource");
const Comment = require("./models/comment");
const User = require('./models/user');
//connect to the database
mongoose.connect('mongodb://localhost:27017/assessr');
// seedDB();
//middleware
app.set("view engine", "ejs");
//serve static files
app.use(express.static(__dirname + "/public"));
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
//set up the routes 
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/resources", (req, res) => {
    var resources = Resource.find({}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.render("resources", {
                resources: data
            });
        }
    });

});
app.post("/resources", (req, res) => {
    var newResource = {
        name: req.body.name,
        image: req.body.image,
        type: req.body.type,
        author: req.body.author,
        description: req.body.description
    };
    Resource.create(newResource, (err, data) => {
        if (err) {
            console.log("there was an error :(");
        } else {
            console.log("Resource added: ");
            console.log(data);
        }
    });
    res.redirect("/resources");
});
app.get("/new", (req, res) => {
    res.render("new");
});
// SHOW - shows more info about one resource
app.get("/resources/:id", (req, res) =>{
    Resource.findById(req.params.id).populate("comments").exec((err, resource) =>{
        if(err){
            console.log(err);
        } else {       
            res.render("show", {resource});
        }
    });
});
//=====================
//  COMMENTS ROUTES
//=====================
app.get('/resources/:id/comments/new', (req, res)=>{
    Resource.findById(req.params.id, (err, data)=>{
        if(err){
            console.log(err);
        }else {
            res.render('comments/new', {resource:data});
        }
    });

app.post('/resources/:id/comments', (req, res)=>{
    
    // lookup resource by ID
    Resource.findById(req.params.id, (err, resource)=>{
        if(err){
            console.log(err);
        }else{
            //create a new comment
            Comment.create(req.body.comment, (err, comment)=>{
                if(err){
                    console.log(err);
                } else{
                    //associate the comment with the resource
                    resource.comments.push(comment);
                    resource.save();
                    res.redirect("/resources/" + resource._id);
                }
            });       
        }
    });   
});
    
});
app.listen(3000 || process.env.PORT, () => console.log("AssessR is up and running"));