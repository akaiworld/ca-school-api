const Person = require('./person.js');

let Course; // require it later
let PersonMethods; // methods provided by the abstraction

exports.init = ({ mongoose, counter }) => {
	
	// apply person crud operations to this module
	const { person } = Person.apply({
		mongoose,
		counter,
		name: 'Teacher',
		module,
	});
	
	PersonMethods = person;
	
	// return access to this module
	return module.exports;
}

exports.loadModules = () => {
	// now after this module is populated with methods 
	// we can require other modules
	Course = require('./course.js');
}

// DELETE
exports.delete = id => {
	// update corresponding objects
	Course.teacherDeleted( id );
	// do delete
	return PersonMethods.delete( id );
}