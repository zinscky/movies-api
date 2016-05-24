var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");

var home = require("./routes/home");
var movies = require("./routes/movies")

mongoose.connect("mongodb://localhost/movie-app");

// Init App
var app = express();

// Morgan Logger Middleware
app.use(morgan("dev"));

// Static Resources
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "client")));


// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use("/", home);
app.use("/api/movies", movies);


app.listen(3000, function() {
    console.log("http://localhost:3000");
})



