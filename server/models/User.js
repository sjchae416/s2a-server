const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		//value cannot be updated
		immutable: true,
	},
});

module.exports = mongoose.model('User', userSchema);
