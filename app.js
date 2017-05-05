
var resourceList = [
    {
        name: "Web Developer Bootcamp",
        image: "https://udemy-images.udemy.com/course/750x422/625204_436a_2.jpg",
        type: "Course",
        author: "Colt Steele"
    },
    {
        name: "You Don't Know JS",
        image: "https://images-na.ssl-images-amazon.com/images/G/01/aplusautomation/vendorimages/e951f3b0-aea8-4bb2-9a14-0fb220ac5bc2.png._CB325458148_.png",
        type: "Book",
        author: "Kyle Simpson"
    },
    {
        name: "Git Essential Training",
        image: "http://websnacks.net/wp-content/uploads/2015/05/Git.png",
        type: "Course",
        author: "Kevin Skoglund"
    }
];



//import npm modules
const express = require("express");
const app = express();
//middleware
app.set("view engine", "ejs");
//serve static files
app.use(express.static(__dirname + "/public"));

//set up the routes
app.get("/", (req, res) =>{
    res.render("index");
});
app.get("/resources", (req, res)=>{
    res.render("resources", {resources: resourceList});
});
app.get("/new",(req, res) =>{
    res.render("new");
});
app.listen(3000 || process.env.PORT, () => console.log("AssessR is up and running"));