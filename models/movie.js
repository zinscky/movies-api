var mongoose = require("mongoose");


// Movie Schema
var movieSchema = mongoose.Schema({
    title: String,
    year: Number,
    genre: String,
    rating: Number,
    votes: Number,
    plot: String,
    img_url: String
}); 

var Movie = module.exports = mongoose.model("movies", movieSchema);


// Add a Movie
module.exports.addMovie = function(movie, callback) {
    Movie.create(movie, callback);
}

// Get a movie by ID
module.exports.getMovieById = function(id, callback) {
    Movie.findById(id, callback);
}

// Get Movies By Year
module.exports.getMoviesByYear = function(year, callback, limit) {
    Movie.find({ year: year }, callback).limit(limit);
}