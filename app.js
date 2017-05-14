//import npm modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
//import models
const Resource = require("./models/resource");
//connect to the database
mongoose.connect('mongodb://localhost:27017/assessr');
//middleware
app.set("view engine", "ejs");
//serve static files
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
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
    Resource.findById(req.params.id, (err, resource) =>{
        if(err){
            console.log(err);
        } else {
            
            res.render("show", {resource});
        }
    });
});
app.listen(3000 || process.env.PORT, () => console.log("AssessR is up and running"));