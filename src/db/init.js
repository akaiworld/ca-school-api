// initialize database and all 
// the related modules
exports.init = db_settings => {
	return new Promise(( resolve, reject ) => {
		
		// initialize the database
		const mongoose = require('./db-connector.js').init( db_settings );
		
		// this will be used by further modules
		const Db = {
			mongoose,
			counter: require('./counter.js'),
		}
		
		// asyncronous, because loading 
		// load existing counters from db
		Db.counter.init( mongoose ).then(() => {
			
			// initialize users to work with API
			const User = require('./user.js').init( Db );
			
			// initialize all the school api modules
			const SchoolApi = require('./school-api/init.js').init( Db );
			
			// if we add other logical groups of functions
			// to work with database
			// we can init them here
			
			// return db modules 
			// for access to database
			// from the app
			resolve({ User, SchoolApi });
		});
	});
}