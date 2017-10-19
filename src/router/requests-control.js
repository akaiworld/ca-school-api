const Passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const Cookies = require('cookies');

// handle authenticaiton
exports.authentication = User => {
	
	// prepare authentication logic
	Passport.use( new Strategy(function( token, fn ){
		if( !token ){
			fn();
			return;
		}
		User.find({ token }).then( user => {
			fn( user );
		}, () => {
			fn();
		});
	}) );
	
	// return the middlewear function
	return ( req, res, next ) => {
		return Passport.authenticate('bearer', { session: false }, user => {
			if( user ){
				next();
			}else{
				res.status( 403 ).json({
					error: 'You must provide a valid access token',
				});
			}
		})( req, res, next );
	}
}

// control one per second request
exports.requestsFrequency = () => ( req, res, next ) => {
	const cookies = new Cookies( req, res );
	const cookie_name = 'request-ts';
	
	const last_request_ts = parseInt( cookies.get( cookie_name ) || 0 );
	const now = Date.now();
	
	// set last request ts
	cookies.set( cookie_name, now );
	
	if( now - last_request_ts < 1000 ){ // less than a second ago
		res.status( 403 ).json({
			error: 'You can only make one per second request',
		});
	}else{
		next();
	}
}