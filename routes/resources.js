const express = require('express');
const router = express.Router();
const dateFormat = require('dateformat');
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
router.post("/", isLoggedIn, (req, res) => {
    var newResource = {
        name: req.body.name,
        image: req.body.image,
        type: req.body.type,
        author: req.body.author,
        description: req.body.description,
        addedBy: {
            id: req.user._id,
            username: req.user.username
        },
    };
    Resource.create(newResource, (err, resource) => {
        if (err) {
            console.log("there was an error :(");
        } else {
            console.log("Resource added: ");
            console.log(resource);
        }
    });
    res.redirect("/resources");
});

router.get("/new", isLoggedIn, (req, res) => {
    res.render("new");
});
// SHOW - shows more info about one resource
router.get("/:id", (req, res) => {
    Resource.findById(req.params.id).populate("comments").exec((err, resource) => {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {
                id: resource._id,
                name: resource.name,
                image: resource.image,
                description: resource.description,
                addedBy: resource.addedBy.username,
                date: dateFormat(resource.dateAdded, 'mmmm/dd/yyyy'),
                comments: resource.comments
            });
        }
    });
});
//EDIT RESOURCE ROUTE
router.get('/:id/edit', (req, res) => {
    Resource.findById(req.params.id, (err, resource) => {
        if (err) {
            console.log(err);
        } else {
            res.render("edit", {
                resource
            });
        }
    });

});

//UPDATE RESOURCE ROUTE
router.put('/:id', (req, res) => {
    Resource.findByIdAndUpdate(req.params.id, req.body.resource,
        (err, resource) => {
            if(err) {
                res.redirect('/resources');
            } else {
                res.redirect('/resources/' + req.params.id);
            }
        });
});
//DELETE RESOURCE ROUTE
router.delete('/:id', (req, res) =>{
    Resource.findByIdAndRemove(req.params.id, (err, result) =>{
        if(err) {
            res.redirect('/resources');
        } else {
            res.redirect('/resources');
        }
    });
});

//my middleware functions
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
module.exports = router;