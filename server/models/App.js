const mongoose = require('mongoose');
const Schema = mongoose.Schema();
const appSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	tables: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Table',
		},
	],
	views: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'View',
		},
	],
});

module.exports = mongoose.model('App', appSchema);
