const Course = require('./course.js');

const BasicCRUD = require('./basic-crud.js');

const collection = 'Grade'; // collection name
let Grade; // mongoose model
let Basic; // basic crud operations

exports.init = ({ mongoose, counter }) => {
	
	// set up set model
	Grade = mongoose.model( collection, prepareScheme( mongoose ) );
	
	// prepare basic CRUD operations for this collection
	Basic = new BasicCRUD( Grade, collection );
	
	// return access to this module
	return module.exports;
}

function prepareScheme( mongoose ){
	// prepare sheme
	const scheme = mongoose.Schema({
		course_id: {
			type: Number,
			required: true,
		},
		student_id: {
			type: Number,
			required: true,
		},
		grade: {
			type: Number,
			required: true,
		},
	});
	
	// get object data without _id and __v
	scheme.methods.json = function(){
		return {
			course_id: this.course_id,
			student_id: this.student_id,
			grade: this.grade,
		}
	}
	
	return scheme;
}

// CREATE
exports.create = ({ course_id, student_id, grade }) => {
	return new Promise(( resolve, reject ) => {
		
		// there must be a course with this student
		Course.find({ id: course_id, students: student_id })
		.then(() => { // course with this student exists here
			
			return Basic.create({
				unique_query: { course_id, student_id }, // only one grade for each pair of course_id and student_id
				data: { course_id, student_id, grade },
			})
			.then( resolve, reject );
		
		}, reject );
	});
}

// READ
exports.read = ({ course_id, student_id }) => {
	return Basic.read({ course_id, student_id });
}

// UPDATE
exports.update = ({ course_id, student_id, grade }) => {
	
	return Basic.update({
		find: { course_id, student_id },
		update: {
			$set: {
				grade,
			}
		},
	});
}

// DELETE
exports.delete = ({ course_id, student_id }) => {
	return Basic.delete({ course_id, student_id });
}

// when a student is deleted
// delete his grades
exports.studentDeleted = student_id => {
	return Grade.deleteMany({
		student_id,
	})
	.exec();
}

// when a course is deleted
// delete its grades
exports.courseDeleted = course_id => {
	return Grade.deleteMany({
		course_id,
	})
	.exec();
}

// student with the highest average in courses
exports.topStudent = () => {
	return new Promise(( resolve, reject ) => {
		Grade.aggregate([
			{
				$group: {
					_id: '$student_id',
					grade: {
						$avg: '$grade'
					},
				},
			},
			{
				$sort: {
					grade: -1
				}
			},
			{
				$limit: 1,
			},
		])
		.exec()
		.then( data => {
			
			if( !data ){
				Basic.dbError( reject )();
			}
			
			resolve( data.length > 0 ? {
				student_id: data[0]._id,
			} : {});
			
		}, Basic.dbError( reject ) );
	});
}

// EASIEST COURSE - course with the highest average of grades
exports.easiestCourse = () => {
	return new Promise(( resolve, reject ) => {
		Grade.aggregate([
			{
				$group: {
					_id: '$course_id',
					avg_grade: {
						$avg: '$grade'
					},
				},
			},
			{
				$sort: {
					avg_grade: -1
				}
			},
			{
				$limit: 1,
			},
		])
		.exec()
		.then( data => {
			
			if( !data ){
				Basic.dbError( reject )();
			}
			
			resolve(data.length > 0 ? {
				course_id: data[0]._id,
			} : {});
			
		}, Basic.dbError( reject ) );
	});
}





















