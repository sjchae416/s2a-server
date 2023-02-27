const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
	// a column whose value is unique for each record. For simplicity, S2A does not support composite keys
	keys: {
		type: Number,
		required: true,
	},
	// a list of columns in the sheet and, for each column: name, initial value, label, reference, type
	cols: [
		{
			name: {
				type: String,
				required: true,
			},
			// the initial value of this column when a record is added to the table. It can be any valid Google Sheets formula. As a special case, it can also be =ADDED_BY(); when a record is added, the email address of the user that added the record is stored in the sheet.
			initialValue: {
				type: String,
			},
			// Boolean indicating whether values in this column should be used as the link text for references to records in this table. This attribute should be set to true for at most one column per table.
			label: {
				type: Boolean,
				required: true,
			},
			// whether the column is a reference to another table, and if so, which table
			reference: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'DataSource',
			},
			// the type of values in the column
			type: {
				type: String,
				required: true,
			},
		},
	],
});

module.exports = mongoose.model('DataSource', tableSchema);
