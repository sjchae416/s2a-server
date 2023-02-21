const mongoose = require('mongoose');
const Schema = mongoose.Schema();
const tableSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	// the URL of the spreadsheet containing the sheet.
	url: {
		type: String,
		required: true,
	},
	// the sheet’s position in the list stored in the “sheets” property of the Spreadsheet object
	sheetIndex: {
		type: Number,
		required: true,
	},
	// a column whose value is unique for each record.  For simplicity, S2A does not support composite keys
	keys: {
		type: Number,
		required: true,
	},
	// a list of columns in the sheet and, for each column: name, initial value, label, reference, type
	cols: {
		// REVIEW choose type or have nested fields
		type: Array,
		required: true,
	},
});

module.exports = mongoose.model('Table', tableSchema);
