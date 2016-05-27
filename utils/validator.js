var Validator = {}

// Check if a string is a positive integer.
Validator.isInteger = function(str) {
  var regex_int = "/^[0-9]{4}$/";
  if(str.match(regex_int)) return true;
  return false;
}

// Check if a string is a Year.
Validator.isYear = function isYear(year) {
  if(Validator.isInteger(year) && year.length === 4) return true;
  return false;
}

module.exports = Validator;
