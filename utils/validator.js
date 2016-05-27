var nodeValidator = require("validator");

var Validator = {};

// Check if a string is a Year.
Validator.isYear = function isYear(year) {
  if(nodeValidator.isInt(year, {min: 1800}) && year.length === 4) return true;
  return false;
};

Validator.validateMovie = function(newMovie) {
  var errors = [];
  
  if(!Validator.isYear(newMovie.year.toString())) errors.push("Year must be a number > 1800.");
  if(!nodeValidator.isDecimal(newMovie.rating.toString())) errors.push("Rating must be a decimal number.");
  if(!nodeValidator.isInt(newMovie.votes.toString(), {min: 0})) errors.push("Votes must be a positive integer.");
  if(!nodeValidator.isURL(newMovie.img_url)) errors.push("Incorrect image url format.");
  return errors;
};

Validator.validateQueryString = function(year1, year2, rating1, rating2, pagination, offset) {
  var errors = [];
  if(!Validator.isYear(year1) || !Validator.isYear(year2)) { 
    errors.push("Incorrect year format.");
  }
  if(!nodeValidator.isInt(pagination, {min: 1, max: 25})) {
    errors.push("Pagination must be a positive integer > 0 but <= 25.");
  }
  if(!nodeValidator.isInt(offset, {min: 0})) {
    errors.push("Offset must be a positive integer.");
  }
  if(!nodeValidator.isDecimal(rating1) || !nodeValidator.isDecimal(rating2)) {
    errors.push("Ratings must be a decimal number.")
  }
  
  console.log("validateQueryString: " + errors);
  
  return errors;
};

module.exports = Validator;
