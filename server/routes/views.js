const express = require('express');
const router = express.Router();
const View = require('../models/View');

// ROUTE Crud - create a View
router.post('/:appId', async (req, res) => {
	const appId = req.params.appId;
	// FIXME add DataSource! and other required: true!

	try {
		const newView = await View.create({ app: appId });
		console.log('New view created successfully: ', newView);

		res.status(201).json(newView);
	} catch (error) {
		console.error('Error while creating new view: ', error);

		res.status(500).json({ message: `Failed to create new View ${appId}` });
	}
});

// ROUTE cRud - read all Views
router.get('/', async (req, res) => {
	try {
		const views = await View.find({});
		console.log('All views found successfully: ', views);

		res.status(200).json(views);
	} catch (error) {
		console.error('Error while creating new view: ', error);

		res.status(404).json({ message: 'Views not found' });
	}
});

// ROUTE cRud - read all app-specific Views
router.get('/:appId', async (req, res) => {
	const appId = req.params.appId;

	try {
		const filterdViews = await View.find({ app: appId });
		console.log('All filtered views found successfully: ', filterdViews);

		res.status(200).json(filterdViews);
	} catch (error) {
		console.error('Error while finding view: ', error);
	}
});

// ROUTE cRud - read a View
router.get('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const view = await View.findById(id);
		console.log('View found: ', view);

		res.status(200).json(view);
	} catch (error) {
		console.error('Error while finding view: ', error);

		res.status(404).json({ message: `View ${id} not found` });
	}
});

// ROUTE crUd = update a View
router.put('/:id', async (req, res) => {
	const id = req.params.id;
	// NOTE usually updates tables field
	const update = req.body;

	try {
		// const updatedView = await View.findByIdAndUpdate(id, update, { new: true });
		// console.log('View updated successfully:', updatedView);

		// res.status(200).json(updatedView);

		await View.findByIdAndUpdate(id, update);
		console.log(`View ${id} updated successfully`);

		res.status(204).send();
	} catch (error) {
		console.error('Error while updating view: ', error);

		res.status(500).json({ message: `Failed to update View ${id}` });
	}
});

// ROUTE cruD - delete a View
router.post('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		// const deletedView = await View.findByIdAndDelete(id);
		// console.log('View deleted successfully', deletedView);

		// res.status(200).json(deletedView);

		await View.findByIdAndDelete(id);
		console.log(`View ${id} deleted successfully`);

		res.status(204).send();
	} catch (error) {
		console.error('Error while deleting view: ', error);

		res.status(500).json({ message: `Failed to delete View ${id}` });
	}
});

module.exports = router;
