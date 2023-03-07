const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const viewSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	// the table containing data for this view. A view can display data from only one table
	table: {
		type: Schema.Types.ObjectId,
		ref: 'Table',
		required: true,
	},
	// set of columns of the table whose values are displayed in this view
	columns: {
		type: [String],
	},
	//  the view type.  Allowed values are “table” and “detail”.
	viewType: {
		type: String,
		required: true,
	},
	// actions permitted in this view. This is a subset of: add record, edit record, delete record. For simplicity, it is sufficient to allow “add record” only in table views and to allow “edit record” only in detail views.
	allowedActions: {
		type: [String],
		required: true,
	},
	//  a set of app-specific roles with access to this view
	roles: {
		type: [String],
		required: true,
	},
	// a column with type Boolean. The view includes only records for which this column’s value equals true.
	filter: {
		type: [Boolean],
	},
	// a column with type Text. The view includes only records for which this column’s value equals the current user’s (logged in) email address
	userFilter: {
		type: [String],
	},
	// a column with type Boolean. The user can edit a record in this view only if this column’s value equals true.
	editFilter: {
		type: [Boolean],
	},
	// the subset of columns in the view that is editable in the view
	editableCols: {
		type: [String],
	},
	app: {
		type: Schema.Types.ObjectId,
		ref: 'App',
		required: true,
	},
});

module.exports = mongoose.model('View', viewSchema);
