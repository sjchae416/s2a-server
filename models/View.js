const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const viewSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	table: {
		type: Schema.Types.ObjectId,
		ref: 'Table',
		required: true,
	},
	columns: {
		type: [String],
	},
	viewType: {
		type: String,
		required: true,
	},
	allowedActions: {
		type: [String],
		required: true,
	},
	roles: {
		type: [String],
		required: true,
	},
	filter: {
		type: String,
	},
	userFilter: {
		type: String,
	},
	editFilter: {
		type: [String],
	},
	editableCols: {
		type: [String],
	},
});

module.exports = mongoose.model('View', viewSchema);
