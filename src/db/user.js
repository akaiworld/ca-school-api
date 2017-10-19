
const collection = 'User'; // collection name
let User; // mongoose model

exports.init = ({ mongoose }) => {
	
	const scheme = mongoose.Schema({
		id: {
			type: Number,
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
	});
	
	User = mongoose.model( collection, scheme );
	
	// create some access tokens for start
	populateWithUsers();
	
	return module.exports;
}

// find user
// now used for authorization
exports.find = query => {
	return new Promise(( resolve, reject ) => {
		User.findOne( query ).exec().then( user => {
			if( !user ){
				reject();
				return;
			}
			resolve( user );
		}, reject );
	});
}

function populateWithUsers(){
	
	const access_tokens = [
		'aI1i5w0_802o6A4X6X7a0M1D8I9',
		'am1a5w0_8Q4q0E3M2U2_0S6N0R5',
		'a61G5k0J8B4U0K36212185177b0',
		'ae185I0W8s4X0m3T294C7w828t3',
		'a81V5G0Z8C4v0p3n2O5E501y3C0',
	];
	
	access_tokens.forEach(( token, id ) => {
		User.updateOne({
			id,
			token,
		}, {
			id,
			token,
		}, {
			upsert: true,
		}).exec();
	});
}