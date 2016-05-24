var express = require("express");
var router = express.Router();

var Movie = require("../models/movie");

// Add a Movie
router.post("/", function(req, res) {
    
    newMovie = new Movie();
    newMovie = req.body;
    Movie.addMovie(newMovie, function(err, result) {
        if(err) handleError(err);
        
        res.json(result);
        
    });
});

// Get a movie by Id
router.get("/:_id", function(req, res) {
    Movie.getMovieById(req.params._id, function(err, result) {
        if(err) handleError(err);
        
        res.json(result);
    });
});

// Get a movie by year
router.get("/:_year/:_limit", function(req, res) {
    Movie.getMoviesByYear(req.params._year, function(err, result) {
        if(err) handleError(err);
        res.json(result);
    }, req.params.limit);
});

module.exports = router;


function handleError(err) {
    res.status("500").send(err);
}