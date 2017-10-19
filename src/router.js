const Express = require('express');
const App = Express();

// require middleware
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');

// own router modules
const RequestsContol = require('./router/requests-control.js');
const Routers = require('./router/routers.js');

// apply middleware
App.use( helmet() ); // secure app by setting various HTTP headers
App.use( cors() ); // enable CORS
App.use( compression() ); // response compression
App.use( bodyParser.json() ); // get JSON requests

exports.init = ({ User, SchoolApi }) => {
	
	// own request control middlewear
	App.use( RequestsContol.authentication( User ) );
	App.use( RequestsContol.requestsFrequency() );
	
	// router api endpoints
	Routers.personCrudRouter({ Express, App, SchoolApi, name: 'student' });
	Routers.personCrudRouter({ Express, App, SchoolApi, name: 'teacher' });
	Routers.gradeCrudApi({ Express, App, SchoolApi });
	Routers.courseCrudApi({ Express, App, SchoolApi });
	Routers.aggregation({ App, SchoolApi });
	
	// listen to requests
	App.listen( process.env.PORT || 8080 );
}

