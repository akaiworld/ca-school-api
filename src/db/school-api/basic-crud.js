// abstraction module with basic CRUD operations

module.exports = class {
	
	constructor( Model, name ){
		this.model = Model;
		this.name = name || 'object'; // for errors and logs
		this.object_not_found_error = this.name+' was not found';
	}

	// CREATE
	create({ unique_query=false, data }){
		return new Promise(( resolve, reject ) => {
			
			// create object only if there are no objects with same values
			this.objectShouldNotExist( unique_query, reject ).then(() => { // object does not exist here
				
				// create new mongoose object
				const object = new this.model( data );
				
				// save to db
				object.save(( e, object ) => {
					
					// handle errors
					if( e || !object ){
						this.dbError( reject )( e );
						return;
					}
					
					resolve( object.json ? object.json() : object );
				});
				
			});
		});
	}
	
	// READ
	read( query ){
		return new Promise(( resolve, reject ) => {
			this.model.findOne( query, '-_id -__v' ).exec().then( object => {
				
				// handle errors
				if( !object ){
					// wrong request parameters
					reject({
						error: this.object_not_found_error,
					});
					return;
				}
				
				resolve( object );
				
			}, this.dbError( reject ));
		});
	}
	
	// UPDATE
	update({ find, update, unique_query=false }){
		return new Promise(( resolve, reject ) => {
			
			// update object only if there are no objects with same new values
			this.objectShouldNotExist( unique_query, reject ).then(() => {
				this.model.updateOne( find, update, {
					runValidators: true,
				})
				.exec()
				.then( data => {
					
					if( this.updateHasErrors( data, reject ) ){
						return;
					}
					
					resolve({
						success: true,
					});
					
				}, this.dbError( reject ));
			});
		});
	}
	
	updateHasErrors( data, reject ){
		// data: { n: 1, nModified: 1, ok: 1 }
		// handle errors
		if( !data || data.ok !== 1 ){
			// db error
			this.dbError( reject )();
			return true;
		}
		if( data.n === 0 ){ // matched documents
			// wrong request parameters
			reject({
				error: this.object_not_found_error,
			});
			return true;
		}
		return false;
	}
	
	// DELETE
	delete( query ){
		return new Promise(( resolve, reject ) => {
			
			this.model.deleteOne( query ).exec().then( data => {
				// data: { result: { n: 1, ok: 1 } }
				
				if( this.deleteHasErrors( data, reject ) ){
					return;
				}
				
				resolve({
					success: true,
				});
				
			}, this.dbError( reject ));
		});
	}
	
	deleteHasErrors( data, reject ){
		// handle errors
		if( !data || !data.result ){
			// db error
			this.dbError( reject )();
			return true;
		}
		if( data && data.result ){
			if( data.result.ok !== 1 ){
				// db error
				this.dbError( reject )();
				return true;
			}
			if( data.result.n !== 1 ){
				// wrong request parameters
				reject({
					error: this.object_not_found_error,
				});
				return true;
			}
		}
		return false;
	}

	
	// HELPER FUNCTIONS
	
	// if unique_query was not passed this step will be omited
	// otherwise if a objects for unique_query already exist
	// and they are not the current one - should be specified in the query
	// an error will be returned by the api
	objectShouldNotExist( query, reject ){
		
		if( !query ){ // in some cases this step should be ommited
			return Promise.resolve();
		}
		
		return new Promise(( resolve ) => {
			this.model.find( query ).exec().then(( objects ) => {
				
				if( !objects ){ // should be empty array at least
					this.dbError( reject );
					return;
				}
				
				// object exists
				if( objects.length > 0 ){
					reject({
						error: 'This '+this.name+' already exist',
					});
					return;
				}
				
				// object does not exist
				// continue running
				resolve();
				
			}, this.dbError( reject ));
		});
	}
	dbError( reject ){
		return ( e={} ) => {
			reject({
				error: 'DB Error',
				details: e,
				status: 500,
			});
		}
	}
}






