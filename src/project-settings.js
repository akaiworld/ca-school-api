module.exports = {
	db_settings: {
		url: (() => {
			let MONGO_DB;
			let DOCKER_DB = process.env.DB_PORT;
			if( DOCKER_DB ){
				MONGO_DB = DOCKER_DB.replace( "tcp", "mongodb" ) + "/ca";
			}else{
				MONGO_DB = process.env.MONGODB;
			}
			return MONGO_DB || 'mongodb://127.0.0.1:27017/ca';
		})()
		// 'mongodb://'+( process.env.DB_IP || '127.0.0.1' )+':'+( process.env.DB_PORT || 27017 )+'/ca', // connection url
	}
}

