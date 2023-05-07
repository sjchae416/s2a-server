const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tableSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
	sheetIndex: {
		type: String,
		required: true,
	},
	columns: [
		{
			name: {
				type: String,
			},
			initialValue: {
				type: String,
			},
			key: {
				type: Boolean,
				required: true,
			},
			label: {
				type: Boolean,
				// required: true,
			},
			// whether the column is a reference to another table, and if so, which table
			reference: {
				// will store either Boolean(false) OR Schema.Types.ObjectId
				type: Schema.Types.Mixed,
			},
			type: {
				type: String,
			},
		},
	],
});

module.exports = mongoose.model('Table', tableSchema);
