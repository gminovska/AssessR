//all my middleware functions go here
const Resource = require('../models/resource');
const Comment = require("../models/comment");

module.exports = {
    checkCommentOwnership: (req, res, next) => {
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, (err, comment) => {
                if (err) {
                    res.redirect('back');
                } else {
                    //check if the logged in user wrote the comment
                    //the equals is a method Mongoose provides. === wouldn't work because one is a string and the other is an ObjectID
                    if (comment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        res.redirect('back');
                    }

                }
            });
        } else {
            res.redirect('back');
        }
    },

    checkResourceOwnership: (req, res, next) => {
        if (req.isAuthenticated()) {
            Resource.findById(req.params.id, (err, resource) => {
                if (err) {
                    res.redirect('back');
                } else {
                    //does the user own the resource
                    //the equals is a method Mongoose provides. === wouldn't work because one is a string and the other is an ObjectID
                    if (resource.addedBy.id.equals(req.user._id)) {
                        next();
                    } else {
                        res.redirect('back');
                    }

                }
            });
        } else {
            res.redirect('back');
        }
    },

    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    }
}