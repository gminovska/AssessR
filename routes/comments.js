const express = require('express');
const router = express.Router({mergeParams: true});
const Resource = require("../models/resource");
const Comment = require("../models/comment");
//=====================
//  COMMENTS ROUTES
//=====================
router.get('/new', isLoggedIn, (req, res) => {
    Resource.findById(req.params.id, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {
                resource: data
            });
        }
    });
});
router.post('/', isLoggedIn, (req, res) => {

    // lookup resource by ID
    Resource.findById(req.params.id, (err, resource) => {
        if (err) {
            console.log(err);
        } else {
            //create a new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    //associate the comment with the resource
                    resource.comments.push(comment);
                    resource.save();
                    res.redirect("/resources/" + resource._id);
                }
            });
        }
    });
});

//my middleware functions
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect('/login');
}
module.exports = router;