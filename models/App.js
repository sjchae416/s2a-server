const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const appSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	creator: {
		type: String,
		required: true,
	},
	views: [
		{
			type: Schema.Types.ObjectId,
			ref: 'View',
		},
	],
	roleMembershipSheet: {
		type: String,
		required: true,
	},
	sheetIndex: {
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
		default: 'Never Opened Yet',
	},
});

module.exports = mongoose.model('App', appSchema);
