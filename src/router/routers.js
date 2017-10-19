
// PERSON CRUD API
exports.personCrudRouter = ({ Express, App, SchoolApi, name }) => {
	const Api = SchoolApi[ name ];
	const Router = Express.Router();
	
	// CREATE
	Router.post('/', ( req, res ) => {
		new RequestProcessor( res, Api.create( req.body ) );
	});
	
	// READ
	Router.get('/:id', ( req, res ) => {
		new RequestProcessor( res, Api.read( req.params.id ) );
	});
	
	// UPDATE
	Router.put('/:id', ( req, res ) => {
		new RequestProcessor( res, Api.update({
			id: req.params.id,
			data: req.body,
		}) );
	});
	
	// DELETE
	Router.delete('/:id', ( req, res ) => {
		new RequestProcessor( res, Api.delete( req.params.id ) );
	});
	
	App.use( '/'+name, Router );
}

// GRADE CRUD API
exports.gradeCrudApi = ({ Express, App, SchoolApi }) => {
	
	const name = 'grade';
	const Api = SchoolApi[ name ];
	const Router = Express.Router();
	
	// CREATE
	Router.post('/', ( req, res ) => {
		new RequestProcessor( res, Api.create({
			course_id: req.body.course_id,
			student_id: req.body.student_id,
			grade: req.body.grade,
		}) );
	});
	
	// READ
	Router.get('/course-:course_id/student-:student_id', ( req, res ) => {
		new RequestProcessor( res, Api.read({
			course_id: req.params.course_id,
			student_id: req.params.student_id,
		}) );
	});
	
	// UPDATE
	Router.put('/course-:course_id/student-:student_id', ( req, res ) => {
		new RequestProcessor( res, Api.update({
			course_id: req.params.course_id,
			student_id: req.params.student_id,
			grade: req.body.grade,
		}) );
	});
	
	// DELETE
	Router.delete('/course-:course_id/student-:student_id', ( req, res ) => {
		new RequestProcessor( res, Api.delete({
			course_id: req.params.course_id,
			student_id: req.params.student_id,
		}) );
	});
	
	App.use( '/'+name, Router );
}

// COURSE CRUD API
exports.courseCrudApi = ({ Express, App, SchoolApi }) => {
	
	const name = 'course';
	const Api = SchoolApi[ name ];
	const Router = Express.Router();
	
	// CREATE
	Router.post('/', ( req, res ) => {
		new RequestProcessor( res, Api.create( req.body ) );
	});
	
	// READ
	Router.get('/:id', ( req, res ) => {
		new RequestProcessor( res, Api.read( req.params.id ) );
	});
	
	// UPDATE
	Router.put('/:id', ( req, res ) => {
		new RequestProcessor( res, Api.update({
			id: req.params.id,
			data: req.body,
		}) );
	});
	
	// ADD STUDENT
	Router.put('/:id/student/:student_id', ( req, res ) => {
		new RequestProcessor( res, Api.addStudent( req.params ) );
	});
	
	// REMOVE STUDENT
	Router.delete('/:id/student/:student_id', ( req, res ) => {
		new RequestProcessor( res, Api.removeStudent( req.params ) );
	});
	
	// DELETE
	Router.delete('/:id', ( req, res ) => {
		new RequestProcessor( res, Api.delete( req.params.id ) );
	});
	
	App.use( '/'+name, Router );
}

// AGGREGATION API
exports.aggregation = ({ App, SchoolApi }) => {
	
	// TOP TEACHER - teacher with the max number of students
	App.get('/top-teacher', ( req, res ) => {
		new RequestProcessor( res, SchoolApi.course.topTeacher() );
	});
	
	// TOP STUDENT - student with the highest average in courses
	App.get('/top-student', ( req, res ) => {
		new RequestProcessor( res, SchoolApi.grade.topStudent() );
	});
	
	// EASIEST COURSE - course with the highest average of grades
	App.get('/easiest-course', ( req, res ) => {
		new RequestProcessor( res, SchoolApi.grade.easiestCourse() );
	});
}

// helper class to process the logic behind a request
class RequestProcessor { // process request and respond later
	constructor( res, promise ){
		this.res = res;
		promise.then( this.success.bind(this), this.fail.bind(this) );
	}
	success( data ){
		this.res.json( data );
	}
	fail( error ){
		this.res.status( error.status || 400 );
		this.res.json( error );
	}
}