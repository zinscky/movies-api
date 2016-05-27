var mongoose = require("mongoose");

// Movie Schema
var movieSchema = mongoose.Schema({
    title: String,
    year: Number,
    genre: [String],
    rating: Number,
    votes: Number,
    plot: String,
    release_date: String,
    language: String,
    imdb_id: {type: String, unique: true},
    director: [String],
    actors: [String],
    writers: [String],
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

// Get Movies By Year Rating Title 
module.exports.getMovies = function(year1, year2, rating1, rating2, callback, limit, offset) {
    year1 = parseInt(year1);
    rating1 = parseInt(rating1);
    rating2 = parseInt(rating2);
    limit = parseInt(limit);
    offset = parseInt(offset);
    
    
    Movie
        .find({
            year: { $gt: year1-1, $lt: year2+1 },
            rating: { $gt: rating1-0.1, $lt: rating2+0.1 }
        }, callback)
        .limit(limit)
        .skip(offset)
        .sort({release_date: -1});
}
