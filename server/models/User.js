const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	apps: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'App',
	},
	views: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'View',
	},
});

module.exports = mongoose.model('User', userSchema);
