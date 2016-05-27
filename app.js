var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");
var dbConfig = require("./configs/database");

// PORT
var port = process.env.PORT || 8080;

var home = require("./routes/home");
var movies = require("./routes/movies")

// MongoDB Connection
mongoose.connect(dbConfig.dbUrl);

// Init App
var app = express();

// Set JSON pretty printing
app.set('json spaces', 2);

// Morgan Logger Middleware
app.use(morgan("dev"));

// Static Resources
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "client")));


// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use("/", home);
app.use("/api/v1/movies", movies);


app.listen(port, function() {
    console.log("http://localhost:" + port);
})
