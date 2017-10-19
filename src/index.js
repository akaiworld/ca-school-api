// load project settings first
const { db_settings } = require('./project-settings.js');

// then initialize the database
require('./db/init.js').init( db_settings ).then(({ User, SchoolApi }) => {
	
	// when school api is already initialized
	// init router end points
	require('./router.js').init({ User, SchoolApi });
	
	console.log('App started');
});