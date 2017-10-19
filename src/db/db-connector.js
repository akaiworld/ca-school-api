const mongoose = require('mongoose');

// initialize database
exports.init = ({ url }) => {
	mongoose.Promise = global.Promise;
	mongoose.connect( url, {
		useMongoClient: true,
	});
	mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	// no need to wait until there is a real connection with mongoose
	return mongoose;
}