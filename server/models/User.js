const mongoose = require('mongoose');
const Schema = mongoose.Schema();
const userSchema = new Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
		required: true,
	},
	accessedView: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'View',
		},
	],
});

module.exports = mongoose.model('User', userSchema);
