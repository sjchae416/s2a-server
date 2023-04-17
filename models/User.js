const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		immutable: true,
	},
	apps: [
		{
			type: Schema.Types.ObjectId,
			ref: 'App',
		},
	],
	tables: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Table',
		},
	],
	views: [
		{
			type: Schema.Types.ObjectId,
			ref: 'View',
		},
	],
});

module.exports = mongoose.model('User', userSchema);
