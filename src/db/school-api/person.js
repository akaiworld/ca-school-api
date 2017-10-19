const { toNameString, emailValidator } = require('../../fns.js');
const BasicCRUD = require('./basic-crud.js');

exports.apply = ({ mongoose, counter, name, module: m }) => {
	
	// set up model
	const Model = mongoose.model( name, prepareScheme( mongoose ) );
	
	// prepare counter
	const Counter = counter.forName( name );
	
	// prepare basic CRUD operations
	const Basic = new BasicCRUD( Model, name );
	
	const Person = { // person methods
		create: create( Basic, Counter ),
		read: read( Basic ),
		update: update( Basic ),
		delete: deletePerson( Basic ),
	}
	
	// assign person crud methods to the passed module
	m.exports = Object.assign( {}, Person, m.exports);
	
	return {
		model: Model,
		counter: Counter,
		basic: Basic,
		person: Person,
	}
}

function prepareScheme( mongoose ){
	// prepare sheme
	const scheme = mongoose.Schema({
		id: {
			type: Number,
			required: true,
		},
		first_name: {
			type: String,
			required: true,
			set: toNameString,
		},
		last_name: {
			type: String,
			required: true,
			set: toNameString,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			validate: emailValidator,
		},
	}, {
		runSettersOnQuery: true,
	});
	
	// get object data without _id and __v
	scheme.methods.json = function(){
		return {
			id: this.id,
			first_name: this.first_name,
			last_name: this.last_name,
			email: this.email,
		}
	}
	
	return scheme;
}

// CREATE
const create = ( Basic, Counter ) => ({ first_name, last_name, email }) => {
	return Basic.create({
		unique_query: { email }, // email field must be unique in a collection
		data: {
			id: Counter.next(), // next counter for this object
			first_name, 
			last_name, 
			email,
		},
	});
}

// READ
const read = Basic => id => {
	return Basic.read({ id });
}

// UPDATE
const update = Basic => ({ id, data: { first_name, last_name, email } }) => {
	
	// prepare query
	const update = { $set: {} };
	if( first_name ) update.$set.first_name = first_name;
	if( last_name ) update.$set.last_name = last_name;
	if( email ) update.$set.email = email;
	
	return Basic.update({
		find: { id },
		update,
		unique_query: email ? { id: {$ne: id}, email } : false, // email field must be unique in a collection
	});
}

// DELETE
const deletePerson = Basic => id => {
	return Basic.delete({ id });
}