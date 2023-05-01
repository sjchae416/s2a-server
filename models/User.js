const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		immutable: true,
	},
	tables: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Table',
		},
	],
	accessToken: {
		type: String,
	},
});

module.exports = mongoose.model('User', userSchema);
