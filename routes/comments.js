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
            var newComment = {
                text: req.body.comment,
                author: {
                    id: req.user._id,
                    username: req.user.username
                }
            };
            Comment.create(newComment, (err, comment) => {
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
//EDIT COMMENT 
router.get('/:comment_id/edit', (req, res)=>{
    console.log(req.params);
    Comment.findById(req.params.comment_id, (err, comment)=>{
        if(err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {
                resource_id: req.params.id,
                comment
            });
        }
    })
});
//UPDATE COMMENT
router.put('/:comment_id', (req, res)=>{  
        Comment.findByIdAndUpdate(req.params.comment_id, {text: req.body.comment}, (err, result)=>{
            if(err) {
                res.redirect(`/resources/${req.params.id}`);
            } else {
                res.redirect(`/resources/${req.params.id}`);
            }
        })  
});
//my middleware functions
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect('/login');
}
module.exports = router;