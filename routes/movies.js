//==============================================================
// For all routes "/api/v1/movies".
// It has folowing end points
// 1. GET - /api/v1/movies/:id
// 2. POST - /api/v1/movies
// 3. GET - /api/v1/movies?y={year}&p={pagination}&o={offset}
//        - Fetches movies according to the year.
// 4. GET - /api/v1/movies?r_low={rating_low}&r_high={rating_high}&p={pagination}&o={offset}
//        - Fetches movies based on ratings usually between low and high
// 5. GET - /api/v1/movies?q={search_string}&pagination={}&offset={}
//        - Search for movie titles. Basic fuzzy search using mongoDB.
// 6. PUT - /api/v1/movies/:id
//        - Modify movie details.
//
// The default pagination is 10
// The default offset is 0
//==============================================================

var express = require("express");
var validator = require("../utils/validator");
var router = express.Router();

var Movie = require("../models/movie");

// GET - /api/v1/movies/:id
// Get a movie by Id
router.get("/:_id", function(req, res) {
    Movie.getMovieById(req.params._id, function(err, result) {
        if(err) handleError(err, res);

        res.json(result);
    });
});

// POST - /api/v1/movies/
// Add a Movie
router.post("/", function(req, res) {
    newMovie = fillMovieObject(req.body);
    console.log(newMovie);
    Movie.addMovie(newMovie, function(err, result) {
        if(err) handleError(err, res);
        res.json({message: "Database Updated"});
    });
});

// GET - /api/v1/movies?y={year}&p={pagination}&o={offset}
// Get Movies by year and set pagination + offset
router.get("/", function(req, res) {
  var year = req.query.y;
  var pagination = req.query.p || "10";
  var offset = req.query.o || "0";
  var errors = [];

  console.log("year: " + year + " pagination: " + pagination + " offset: " + offset);

  if(!validator.isYear(year)) errors.push("Incorrect year format.");
  if(!validator.isInteger(pagination)) errors.push("Pagination must be a positive integer.");
  if(!validator.isInteger(offset)) errors.push("Offset must be a positive integer.");

  // Check if total records is less than offset


  // If there are validation errors then send response
  // as false and and array of all the errors.

  console.log("errors length: " + errors.length);
  if(errors.length > 0) {
    console.log("errors : " + errors);
    res.json({
      response: false,
      errors: errors
    });
  } else {
    Movie.getMoviesByYear(parseInt(year), function(err, result) {
      if(err) handleError(err, res);
        if(result) {
          res.json(result);
        } else {
          res.json({
            respose: false,
            errors: "No movies found."
          });
        }
    }, parseInt(pagination));
  }
});

module.exports = router;


function handleError(err, res) {
    res.status("500").send(err);
}


// Private Function. To fill newMovie object with data from client
function fillMovieObject(movie) {
    newMovie = new Movie();

    movie.imdbVotes = movie.imdbVotes.replace(/\,/g, "");

    newMovie.title = movie.Title;
    newMovie.year = parseInt(movie.Year);
    newMovie.genre = movie.Genre.split(",");
    newMovie.rating = parseFloat(movie.imdbRating);
    newMovie.votes = parseInt(movie.imdbVotes);
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
