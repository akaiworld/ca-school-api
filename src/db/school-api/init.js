
exports.init = Db => {
	
	// init school api modules
	const SchoolApi = {
		student: require('./student.js').init( Db ), // init these two first
		teacher: require('./teacher.js').init( Db ), // cause they are populated with methods dynamically
		course: require('./course.js').init( Db ),
		grade: require('./grade.js').init( Db ),
	}
	
	// these modules are populated with methods dynamically
	// they need to load other dependency modules later
	SchoolApi.student.loadModules();
	SchoolApi.teacher.loadModules();
	
	return SchoolApi;
}