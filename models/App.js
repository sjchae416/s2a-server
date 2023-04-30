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
