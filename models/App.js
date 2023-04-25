const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const appSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	// the user who created the app
	creator: {
		type: String,
		required: true,
	},
	// a set of views
	views: [
		{
			type: Schema.Types.ObjectId,
			ref: 'View',
		},
	],
	// URL of a spreadsheet containing role membership information
	roleMembershipSheet: {
		type: String,
		required: true,
	},
	// a Boolean indicating whether the app is visible to its end users
	published: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: String,
	},
	lastModifiedDate: {
		type: String,
	},
	lastOpenedDate: {
		type: String,
	},
});

module.exports = mongoose.model('App', appSchema);
