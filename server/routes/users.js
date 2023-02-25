const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ROUTE cRud - get all Users
router.get('/', async (req, res) => {
	try {
		const users = await User.find({});
		console.log('All models found successfully: ', users);

		res.send(users);
	} catch (error) {
		console.error('Error while creating new model: ', error);
	}
});

// ROUTE cRud - get a User
// REVIEW get user by _id or email?
router.get('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const user = await User.findById(id);
		console.log('Model found: ', user);

		res.send(user);
	} catch (error) {
		console.error('Error while finding model: ', error);
	}
});

// ROUTE Crud - create a User
router.post('/:email', async (req, res) => {
	const email = req.params.email;

	try {
		// const newUser = new User({
		// 	email: email,
		// });

		// await newUser.save();

		const newUser = await User.create({ email: email });
		console.log('New model created successfully: ', newUser);

		res.send(newUser);
	} catch (error) {
		console.error('Error while creating new model: ', error);
	}
});

// ROUTE cruD - delete a User
router.delete('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		await User.findByIdAndDelete({ id });

		console.log(
			'Model deleted successfully: '
			// , deletedUser
		);
	} catch (error) {
		console.error('Error while deleting model: ', error);
	}
});

module.exports = router;
