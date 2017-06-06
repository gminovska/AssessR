const express = require('express');
const router = express.Router({mergeParams: true});
const Resource = require("../models/resource");
const Comment = require("../models/comment");
const {isLoggedIn, checkCommentOwnership} = require("../middleware/index");
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
                    req.flash('error',"An error occured, please try again");
                    res.redirect("/resources/" + resource._id);
                } else {
                    //associate the comment with the resource
                    resource.comments.push(comment);
                    resource.save();
                    req.flash('success',"Comment added");
                    res.redirect("/resources/" + resource._id);
                }
            });
        }
    });
});
//EDIT COMMENT 
router.get('/:comment_id/edit', checkCommentOwnership, (req, res)=>{
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
router.put('/:comment_id', checkCommentOwnership, (req, res)=>{  
        Comment.findByIdAndUpdate(req.params.comment_id, {text: req.body.comment}, (err, result)=>{
            if(err) {
                req.flash('error',"Comment update failed, please try again");
                res.redirect(`/resources/${req.params.id}`);
            } else {
                req.flash('success',"Comment updated");
                res.redirect(`/resources/${req.params.id}`);
            }
        })  
});
//DELETE COMMENT
router.delete('/:comment_id',checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err, result)=>{
        if(err) {
            req.flash('error',"Comment delete failed, please try again");
            res.redirect(`/resources/${req.params.id}`);
        } else {
            req.flash('success',"Comment deleted");
            res.redirect(`/resources/${req.params.id}`);
        }
    })
});

module.exports = router;