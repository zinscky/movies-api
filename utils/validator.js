var Validator = {}

// Check if a string is a positive integer.
Validator.isInteger = function(str) {
  //console.log("String: " + str);
  var num = parseInt(str);
  if(num === NaN) return false;
  if(num.toString().length !== str.length) return false;
  if(num < 0) return false;
  return true;
}

// Check if a string is a Year.
Validator.isYear = function isYear(year) {
  if(!Validator.isInteger(year)) return false;
  if(year.length != 4) return false;
  return true;
}

module.exports = Validator;
