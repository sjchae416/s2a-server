const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const appSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	// the user who creatd the app
	creator: {
		type: String,
		required: true,
	},
	//  a set of data sources (tables)
	dataSources: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'DataSource',
		},
	],
	// a set of views
	views: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'View',
		},
	],
	// URL of a spreadsheet containing role membership information
	// roleMembershipSheet: {
	// 	type: String,
	// 	required: true,
	// },
	roles: {
		type: Schema.Types.Mixed,
		required: true,
	},
	published: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('App', appSchema);
