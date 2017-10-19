const BasicCRUD = require('./basic-crud.js');

const Student = require('./student.js');
const Teacher = require('./teacher.js');
const Grade = require('./grade.js');

const collection = 'Course'; // collection name
let Course; // mongoose model
let Counter; // counter for the collection
let Basic; // basic crud operations

exports.init = ({ mongoose, counter }) => {
	
	// set up set model
	Course = mongoose.model( collection, prepareScheme( mongoose ) );
	
	// prepare counter
	Counter = counter.forName( collection );
	
	// prepare basic CRUD operations for this collection
	Basic = new BasicCRUD( Course, collection );
	
	// return access to this module
	return module.exports;
}

function prepareScheme( mongoose ){
	// prepare sheme
	const scheme = mongoose.Schema({
		id: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		students: [Number],
		teacher_id: {
			type: Number,
			required: true,
		},
	});
	
	// get object data without _id and __v
	scheme.methods.json = function(){
		return {
			id: this.id,
			name: this.name,
			students: this.students,
			teacher_id: this.teacher_id,
		}
	}
	
	return scheme;
}

// CREATE
exports.create = ({ name, teacher_id }) => {
	return new Promise(( resolve, reject ) => {
		
		// only existing teacter or 0(teacher not assinged yet) 
		// can be added to a course
		teacherExists({ teacher_id, reject }).then(() => {
			
			Basic.create({
				unique_query: { name }, // name must be unique for the colleciton
				data: {
					id: Counter.next(), // next counter for this object
					name,
					students: [], // empty when created
					teacher_id,
				},
			})
			.then( resolve, reject );
		
		});
	});
}

const teacherExists = ({ teacher_id, reject }) => {
	
	// no teacher will be assigned to a course
	if( teacher_id === 0 ){
		return Promise.resolve();
	}
	
	return new Promise(( resolve ) => {
		Teacher.read( teacher_id ).then( resolve, reject );
	});
}

// READ
exports.read = id => {
	return Basic.read({ id });
}

// for quering by custom query
exports.find = query => {
	return Basic.read( query );
}

// UPDATE
exports.update = ({ id, data: { name, teacher_id } }) => {
	return new Promise(( resolve, reject ) => {
	
		teacherExists({ teacher_id, reject }).then(() => {
			
			// prepare query
			const update = { $set: {} };
			if( name ) update.$set.name = name;
			if( teacher_id ) update.$set.teacher_id = teacher_id;
			
			Basic.update({
				find: { id },
				update,
				unique_query: name ? { id: {$ne: id}, name } : false, // name field must be unique in a collection
			})
			.then( resolve, reject );
		});
	});
}

// ADD STUDENT
exports.addStudent = ({ id, student_id }) => {
	return new Promise(( resolve, reject ) => {
		
		// student must exist
		Student.read( student_id ).then(() => {
			
			Basic.update({
				find: { id },
				update: {
					$addToSet: {
						students: student_id,
					}
				}
			})
			.then( resolve, reject );
			
		}, reject);
	});
}

// REMOVE STUDENT
exports.removeStudent = ({ id, student_id }) => {
	return new Promise(( resolve, reject ) => {
			
		Basic.update({
			find: { id },
			update: {
				$pull: {
					students: student_id,
				}
			},
		})
		.then( resolve, reject );
	});
}

// DELETE
exports.delete = id => {
	Grade.courseDeleted( id );
	return Basic.delete({ id });
}

// when a teacher is deleted
// set teacher_id = 0 to all corresponding courses
// means that no teacher is assigned
exports.teacherDeleted = teacher_id => {
	return Course.updateMany({
		teacher_id,
	}, {
		$set: {
			teacher_id: 0,
		}
	})
	.exec();
}

// when a student is deleted
// remove him from all corresponding courses
exports.studentDeleted = student_id => {
	return Course.updateMany({
		students: student_id,
	}, {
		$pull: {
			students: student_id,
		}
	})
	.exec();
}

// teacher with the max number of students
exports.topTeacher = () => {
	return new Promise(( resolve, reject ) => {
		Course.aggregate([
			{
				$unwind: '$students',
			},
			{
				$group: {
					_id: '$teacher_id',
					students: {
						$addToSet: '$students'
					},
				},
			},
			{
				$unwind: '$students',
			},
			{
				$sortByCount: '$_id',
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
				teacher_id: data[0]._id,
			} : {});
			
		}, Basic.dbError( reject ) );
	});
}









