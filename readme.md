Project structure

	/src - source code
		index.js - initializes the app
		fns.js - helper functions
		project-settings.js - common settings for the project
		
		router.js - does all the routing
			/router
				requests-control.js - add custom middlewear for security
				routers.js - api endpoints are here
		
		/db - database relates modules here
			init.js - init all db modules
			db-connector.js - prepare the db connection
			counter.js - create numeric ids for other collections
			user.js - for authorization
			
			/school-api - school related api
				init.js - init all related modules
				basic-crud.js - basic CRUD operations abscraction
				person.js - CRUD abstraction for student and teacher
				student.js
				grade.js
				teacher.js
				grade.js

		
App logic.
There are several predefined users with their BEARER tokens:

	aI1i5w0_802o6A4X6X7a0M1D8I9
	am1a5w0_8Q4q0E3M2U2_0S6N0R5
	a61G5k0J8B4U0K36212185177b0
	ae185I0W8s4X0m3T294C7w828t3
	a81V5G0Z8C4v0p3n2O5E501y3C0

The user has to pass a valid access token in order to perform requests.
Requests from each user (by cookies for now) can be made only once per second.
Each user has access to all teachers, students, cources and grades.

Objects are interconnected. This means for example that if a student is removed, his grades are removed and courses he was in are updated.  

Content-Type must be application/json

Api endpoints(with body examples):

	TEACHERS
	
		POST http://localhost/teacher
			{
				"first_name": "Mike",
				"last_name": "Tyson",
				"email": "mike@gmail.com" - must be unique
			}
			on success returns:
			{
				first_name, 
				last_name,
				email,
				id,
			}
			
		GET http://localhost/teacher/TEACHER_ID
			on success returns:
			{
				first_name, 
				last_name,
				email,
				id,
			}
			
		PUT http://localhost/teacher/TEACHER_ID
			{
				"first_name": "Mike",
				"last_name": "Tyson",
				"email": "mike-2@gmail.com" - must be unique
			}
			on success returns:
			{
				success: true
			}
			
		DELETE http://localhost/teacher/TEACHER_ID
			on success returns:
			{
				success: true
			}
	
	
	STUDENTS
	
		POST http://localhost/student
			{
				"first_name": "Floyd",
				"last_name": "Mayweather",
				"email": "floyd@gmail.com" - must be unique
			}
			on success returns:
			{
				first_name, 
				last_name,
				email,
				id,
			}
			
		GET http://localhost/student/STUDENT_ID
			on success returns:
			{
				first_name, 
				last_name,
				email,
				id,
			}
			
		PUT http://localhost/student/STUDENT_ID
			{
				"first_name": "Floyd",
				"last_name": "Mayweather",
				"email": "floyd-2@gmail.com" - must be unique
			}
			on success returns:
			{
				success: true
			}
			
		DELETE http://localhost/student/STUDENT_ID
			on success returns:
			{
				success: true
			}
	
	
	COURSES
		POST http://localhost/course
			{
				"teacher_id": TEACHER_ID,
				"name": "Boxing" - must be unique
			}
			on success returns:
			{
				id,
				teacher_id,
				name,
				students, - array of student ids
			}
			
		GET http://localhost/course/COURSE_ID
			on success returns:
			{
				id,
				teacher_id,
				name,
				students, - array of student ids
			}
			
		PUT http://localhost/course/COURSE_ID
			{
				"teacher_id": TEACHER_ID,
				"name": "Boxing" - must be unique
			}
			on success returns:
			{
				success: true
			}
			
		DELETE http://localhost/course/COURSE_ID
			on success returns:
			{
				success: true
			}
			
		PUT http://localhost/course/COURSE_ID/student/STUDENT_ID
			on success returns:
			{
				success: true
			}
			
		DELETE http://localhost/course/COURSE_ID/student/STUDENT_ID
			on success returns:
			{
				success: true
			}
	
	
	GRADES
		POST http://localhost/grade
			{
				course_id: COURSE_ID,
				student_id: STUDENT_ID,
				grade: 5,
			}
			on success returns:
			{
				course_id,
				student_id,
				grade,
			}
			
		GET http://localhost/grade/course-COURSE_ID/student-STUDENT_ID
			on success returns:
			{
				course_id,
				student_id,
				grade,
			}
			
		PUT http://localhost/grade/course-COURSE_ID/student-STUDENT_ID
			{
				grade: 5,
			}
			on success returns:
			{
				success: true
			}
			
		DELETE http://localhost/grade/course-COURSE_ID/student-STUDENT_ID
			on success returns:
			{
				success: true
			}
	
	
	AGGREGATION
		GET http://localhost/top-teacher
			on success returns:
			{
				teacher_id,
			}
		
		GET http://localhost/top-student
			on success returns:
			{
				student_id,
			}
			
		GET http://localhost/easiest-course
			on success returns:
			{
				course_id,
			}


Data is validated via mongoose built in validators as well as customs ones(email validator).
All the endpoints return corresponding statuses(200,400,404,500) according to the result.
Unique fields are checked and duplicates are prevented to be saved to the database.

App uses MongoDB, ca database.

To run with docker clone the repository and run:
docker-compose build
docker-compose run --publish 80:8080 web















