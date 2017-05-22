const express = require('express');
const router = express.Router();
const Resource = require("../models/resource");
const Comment = require("../models/comment");

router.get("/", (req, res) => {
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
router.post("/", (req, res) => {
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

router.get("/new", (req, res) => {
    res.render("new");
});
// SHOW - shows more info about one resource
router.get("/:id", (req, res) => {
    Resource.findById(req.params.id).populate("comments").exec((err, resource) => {
        if (err) {
            console.log(err);
        } else {
            console.log(resource);
            res.render("show", {
                resource
            });
        }
    });
});

module.exports = router;