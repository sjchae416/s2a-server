const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const appSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
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
	// REVIEW createdAt is saved in DB in ISO 8601 format (UTC) so convert this timestamp to ETC and subtract 4 hours from UTC
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
	lastModifiedDate: {
		type: Date,
	},
	lastOpenedDate: {
		type: Date,
	},
});

module.exports = mongoose.model('App', appSchema);
