//==============================================================
// For all routes "/api/v1/movies".
// It has folowing end points
// 1. GET - /api/v1/movies/:id
// 2. POST - /api/v1/movies
// 3. GET - /api/v1/movies?y={year}&p={pagination}&o={offset}
//        - Fetches movies according to the year.
// 4. GET - /api/v1/movies?r_low={rating_low}&r_high={rating_high}&p={pagination}&o={offset}
//        - Fetches movies based on ratings usually between low and high
// 5. GET - /api/v1/movies/search?q={search_string}&pagination={}&offset={}
//        - Search for movie titles. Basic fuzzy search using mongoDB.
// 6. PUT - /api/v1/movies/:id
//        - Modify movie details.
//
// TODO: Combine 3, 4 and 5 into GET - /api/v1/movies?title,rating,year
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
        if(err) return handleError(err, res);

        if(result) {
          res.status(200); // Success
          res.json(result);
        } else {
          res.status("404"); // Not Found. 
          res.json({
            response: false,
            errors: ["Movie not found."]
          });
        }
        
    });
});

// POST - /api/v1/movies/
// Add a Movie
router.post("/", function(req, res) {
    var newMovie = fillMovieObject(req.body);
    console.log(newMovie);
    var errors = [];
    errors = validator.validateMovie(newMovie);
    
    // Check if there are validation errors
    if(errors.length > 0) {
      console.log("errors : " + errors);
    res.status("400"); // Bad request since form data validation failed
    return res.json({
      response: false,
      errors: errors
    });
    }
    
    
    Movie.findOne({imdb_id: newMovie.imdb_id}, function(err, result) {
      if(err) return handleError(err, res);
      if(result) {
        res.status("409"); //Conflict since movie already is in the database
        res.json({
          response: false,
          errors: ["Movie already exists in the database."]
        });
      } else { // Add the movie to the database
        Movie.addMovie(newMovie, function(err, result) {
          if(err) return handleError(err, res);
          res.status("201"); // Created. Created a new document in the database
          res.json({
            response: true,
            errors: []
        });
    });
      }
    });
    
    
});

// Middleware to check querystring
// Should come after POST - api/v1/movies since
// we are checking for querystring in the same endpoint but 
// on GET request.
/**
router.use("/", function(req, res, next) {
  if(Object.keys(req.query).length !== 0) {
    next();
  } else {
    res.status("400"); // Bad request since client didnt provie querystring
    res.json({
      response: false,
      errors: [
        "No query parameters specified."
        ]
    });
  }
  
});
*/

// ================================================================================
// No need for middleware to check is querystring is empty.
// If querystring is empty then by default get all movies with 
// default pagination = 10
// default offset = 0
// GET - /api/v1/movies?y1={year}&y2={year}&r1={}&r2={}&p={pagination}&o={offset}
// Get Movies by year and set pagination + offset
// =================================================================================
router.get("/", function(req, res) {
  var year1 = req.query.y1 || "1800";
  var year2 = req.query.y2 || "2999";
  var rating1 = req.query.r1 || "0";
  var rating2 = req.query.r2 || "10";
  var pagination = req.query.p || "10";
  var offset = req.query.o || "0";
  var errors = [];

  console.log("year: " + year1 + ", " + year2 + " Rating: " + rating1 
    + ", " + rating2 + " pagination: " + pagination + " offset: " + offset);

  // Querystring Validation
  errors = validator.validateQueryString(year1, year2, rating1, rating2, pagination, offset);
  
  // ===================================================
  // TODO
  // Check if total records is less than offset
  // Part of pagination
  // ===================================================

  // If there are validation errors then send response
  // as false and and array of all the errors.
  console.log("errors length: " + errors.length);
  if(errors.length > 0) {
    console.log("errors : " + errors);
    res.status("400"); // Bad request since query validation failed
    return res.json({
      response: false,
      errors: errors
    });
  } 
   
    Movie.getMovies(year1, year2, rating1, rating2, function(err, result) {
      if(err) return handleError(err, res);
        if(result.length > 0) {
          res.status("200"); // Successful
          res.json(result);
        } else {
          res.status("404"); // Not found. Since movie doesnt exist in database
          res.json({
            response: false,
            errors: "No movies found."
          });
        }
    }, pagination, offset);
  
});

// 404 ERROR Route
router.all("/", function(req, res) {
  res.status("404");
  res.json({
    response: false,
    errors: ["404: Resource Not Found."]
  });
});

module.exports = router;


function handleError(err, res) {
    res.status("500").send(err);
}


// Private Function. To fill newMovie object with data from client
function fillMovieObject(movie) {
    var newMovie = new Movie();

    movie.imdbVotes = movie.imdbVotes.replace(/\,/g, "");

    newMovie.title = movie.Title;
    newMovie.year = parseInt(movie.Year, 10);
    newMovie.genre = movie.Genre.split(",");
    newMovie.rating = parseFloat(movie.imdbRating);
    newMovie.votes = parseInt(movie.imdbVotes, 10);
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
