// first letter capitalized
// other to lower case
exports.toNameString = str => {
	str = str.toLowerCase();
	str = str[0].toUpperCase()+str.substr(1);
	return str;
}

// validators
const validator = require('validator');

// specifically for mongoose
exports.emailValidator = {
	validator: value => {
		return validator.isEmail( value );
	},
	message: '{VALUE} is not a valid e-mail!',
}
