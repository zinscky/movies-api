var express = require("express");
var router = express.Router();

var Movie = require("../models/movie");

// Add a Movie
router.post("/", function(req, res) {
    newMovie = fillMovieObject(req.body);
    console.log(newMovie);
    Movie.addMovie(newMovie, function(err, result) {
        if(err) handleError(err, res);
        
        res.json({message: "Database Updated"});
        
    });
});

// Get a movie by Id
router.get("/:_id", function(req, res) {
    Movie.getMovieById(req.params._id, function(err, result) {
        if(err) handleError(err, res);
        
        res.json(result);
    });
});

// Get a movie by year
router.get("/:_year/:_limit", function(req, res) {
    Movie.getMoviesByYear(req.params._year, function(err, result) {
        if(err) handleError(err, res);
        res.json(result);
    }, req.params.limit);
});

module.exports = router;


function handleError(err, res) {
    res.status("500").send(err);
}


// Private Function. To fill newMovie object with data from client
function fillMovieObject(movie) {
    newMovie = new Movie();
    
    newMovie.title = movie.Title;
    newMovie.year = movie.Year;
    newMovie.genre = movie.Genre.split(",");
    newMovie.rating = movie.imdbRating;
    newMovie.votes = movie.imdbVotes;
    newMovie.plot = movie.Plot;
    newMovie.release_date = movie.Released;
    newMovie.language = movie.Language;
    newMovie.imdb_id = movie.imdbID;
    newMovie.director = movie.Director.split(",");
    newMovie.actors = movie.Actors.split(",");
    newMovie.writers = movie.Writer.split(",");
    newMovie.img_url = movie.Poster;
    
    return newMovie;
    
}