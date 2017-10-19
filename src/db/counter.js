// this module lets us create custom ids 
// each starting from 1 for each domain
// it is better for the API endpoints to accept
// clear ids instead of long and not understandable _id

let Counter; // mongoose model
const counters = {} // counter mongoose objects

exports.init = mongoose => {
	return new Promise(( resolve, reject ) => {
		
		const scheme = prepareScheme( mongoose );
		
		// set up set model
		Counter = mongoose.model( 'Counter', scheme );
		
		// promise will be resolved after loading counters
		loadCounters( resolve );
	});
}

function prepareScheme( mongoose ){

	const scheme = mongoose.Schema({
		name: {
			type: String,
			required: true,
		},
		counter: {
			type: Number,
			required: true,
		},
	});
	
	// syncronously create and get counter
	// asyncronously save to db
	scheme.methods.next = function(){
		// update counter
		this.counter++;
		// save asyncroniuosly to db
		this.save();
		// return new value
		return this.counter;
	}
	
	return scheme;
}

function loadCounters( resolve ){
	// there won't be much counters
	// so just load them all right away
	// cause they all will be needed in this app
	// if not we can change this approach for selective loading
	Counter.find({}).exec().then( db_counters => {
		
		// if any errors for debug
		if( !db_counters ){
			console.error('Counters load error', e, counters);
		}
		
		// fill counters with objects from the db
		db_counters.forEach(( counter ) => {
			counters[ counter.name ] = counter;
		});
		
		// resolve the promise
		resolve();
	});
}

// syncronously create and start using counter
// asyncronously save to db
exports.forName = name => {
	
	// return if exists
	if( counters[ name ] ){
		return counters[ name ];
	}
	
	// create a new mongoose object
	counters[ name ] = new Counter({
		name,
		counter: 0,
	});
	
	// save asyncronuosly to db
	counters[ name ].save();
	
	// return new object syncronously
	return counters[ name ];
}