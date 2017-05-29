const mongoose = require('mongoose');
const passport = require('passport');
const Resource = require("./models/resource");
const Comment = require("./models/comment");
const User = require('./models/user');
const password = require('./config').password;

var data = [{
        name: 'Web Developer Bootcamp',
        image: 'https://udemy-images.udemy.com/course/750x422/625204_436a_2.jpg',
        type: 'Course',
        author: 'Colt Steele',
        description: 'A comprehensive full-stack JavaScript course that teaches web development from ground zero. The instruction is really good, the author understands the most common problem beginners struggle with. This is a hands-on course filled with various projects.'
    },
    {
        name: 'You Don\'t Know JS',
        image: 'https://images-na.ssl-images-amazon.com/images/G/01/aplusautomation/vendorimages/e951f3b0-aea8-4bb2-9a14-0fb220ac5bc2.png._CB325458148_.png',
        type: 'Book',
        author: 'Kyle Simpson',
        description: 'This is a series of books diving deep into the core mechanisms of the JavaScript language. This is a must-read for developers who truly want to understand how javascript works'
    },
    {
        name: 'Eloquent JavaScript',
        image: 'http://eloquentjavascript.net/img/cover.png',
        type: 'Book',
        author: 'Marijn Haverbeke',
        description: 'A book providing an introduction to the JavaScript language and programming in general. It is an excellent resource for beginners'
    },
    {
        name: 'Dom Enlightenment',
        image: 'https://images-na.ssl-images-amazon.com/images/I/51KZAS1X6HL._SX386_BO1,204,203,200_.jpg',
        type: 'Book',
        author: 'Cody Lindley',
        description: 'This book is about how to manipulate HTML more efficiently by scripting the Document Object Model (DOM) without a DOM library. It is bast suited for intermediate and advanced developers who have experience with JavaScript, HTML and CSS'
    },
    {
        name: 'Git Essential Training',
        image: 'http://websnacks.net/wp-content/uploads/2015/05/Git.png',
        type: 'Course',
        author: 'Kevin Skoglund',
        description: 'Comprehensive course that illustrates the git commands on an example website. Terrific instruction that goes beyond the basics of version control and touches upon project collaboration and github workflows'
    },
    {
        name: 'JavaScript Allonge',
        image: 'https://s3.amazonaws.com/titlepages.leanpub.com/javascript-allonge/hero?1443909685',
        type: 'Book',
        author: 'Reginald Braithwaite',
        description: 'JavaScript Allongé is a book about programming with functions, because JavaScript is a programming language built on flexible and powerful functions.'
    }
];

function seedDB() {

    //remove all existing resources
    Resource.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log("removed all resources!");
    });
    //remove all comments
    Comment.remove({}, (err, result)=>{
        if(err) {
            console.log(err);
        } else {
            console.log('Removed all comments');
        }
    });
    //create a user
    var seedUser = {};
    User.register(new User({
        username: 'assessr'
    }), password, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            //bind the newly created user id to a variable to be used in another functions
            seedUser.id = user._id;
            seedUser.username = user.username;
            console.log('Created new user');

            //create resouces that have that user associated with them
            data.forEach((resource) => {
                Resource.create(resource, (err, newResource) => {
                    if (err) {
                        console.log(err);
                    } else {
                        //associate the resource with the seedUser
                        newResource.addedBy = seedUser;
                        //create comment on each resource 
                        Comment.create({
                            text: "Great resource, I learned a lot from it!",
                            author: seedUser
                        }, (err, newComment) => {
                            if (err) {
                                console.log(err);
                            } else {
                                //push the comment into the resource array
                                newResource.comments.push(newComment);
                                newResource.save();
                                console.log('Resource added');
                            }
                        });
                    }
                });
            });
        }
    });



}

module.exports = seedDB;