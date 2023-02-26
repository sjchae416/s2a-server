const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ROUTE Crud - create a User
router.post('/:email', async (req, res) => {
	const email = req.params.email;

	try {
		// const newUser = new User({
		// 	email: email,
		// });

		// await newUser.save();

		const newUser = await User.create({ email: email }).exec();
		console.log('New user created successfully: ', newUser);

		res.status(201).json(newUser);
	} catch (error) {
		console.error('Error while creating new user: ', error);

		res.status(500).json({ message: `Failed to create new User ${email}` });
	}
});

// ROUTE cRud - read all Users
router.get('/', async (req, res) => {
	try {
		const users = await User.find({}).exec();
		console.log('All users found successfully: ', users);

		res.status(200).json(users);
	} catch (error) {
		console.error('Error while creating new user: ', error);

		res.status(404).json({ message: 'Users not found' });
	}
});

// ROUTE cRud - read a User
// REVIEW read user by _id or email?
router.get('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const user = await User.findById(id).exec();
		console.log('User found: ', user);

		res.status(200).json(user);
	} catch (error) {
		console.error('Error while finding user: ', error);

		res.status(404).json({ message: `User ${id} not found` });
	}
});

// ROUTE crUd = update a User
router.put('/:id', async (req, res) => {
	const id = req.params.id;
	// NOTE usually updates views field
	// NOTE req.body expects e.g. { email: updatedEmail@gmail.com, views: [...views, newView._id] }
	const update = req.body;

	try {
		// const updatedUser = await User.findByIdAndUpdate(id, update, { new: true }).exec();
		// console.log('User updated successfully:', updatedUser);

		// res.status(200).json(updatedUser);

		await User.findByIdAndUpdate(id, update).exec();
		console.log(`User ${id} updated successfully`);

		res.status(204).send();
	} catch (error) {
		console.error('Error while updating user: ', error);

		res.status(500).json({ message: `Failed to update User ${id}` });
	}
});

// ROUTE cruD - delete a User
router.delete('/:id', async (req, res) => {
	const id = req.params.id;
	// REVIEW
	// const id = req.body.id

	try {
		// const deletedUser = await User.findByIdAndDelete(id).exec();
		// console.log('User deleted successfully', deletedUser);

		// res.status(200).json(deletedUser);

		await User.findByIdAndDelete(id).exec();
		console.log(`User ${id} deleted successfully`);

		res.status(204).send();
	} catch (error) {
		console.error('Error while deleting user: ', error);

		res.status(500).json({ message: `Failed to delete User ${id}` });
	}
});

module.exports = router;
