const express = require('express');
const router = express.Router();
const App = require('../models/App');

// ROUTE Crud - create a App
router.post('/:name', async (req, res) => {
	const name = req.params.name;

	try {
		const newApp = await App.create({ name: name });
		console.log('New app created successfully: ', newApp);

		res.status(201).json(newApp);
	} catch (error) {
		console.error('Error while creating new app: ', error);

		res.status(500).json({ message: `Failed to create new App ${name}` });
	}
});

// ROUTE cRud - get all Apps
router.get('/', async (req, res) => {
	try {
		const apps = await App.find({});
		console.log('All apps found successfully: ', apps);

		res.status(200).json(apps);
	} catch (error) {
		console.error('Error while creating new app: ', error);

		res.status(404).json({ message: 'Apps not found' });
	}
});

// ROUTE cRud - get a App
router.get('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const app = await App.findById(id);
		console.log('App found: ', app);

		res.status(200).json(app);
	} catch (error) {
		console.error('Error while finding app: ', error);

		res.status(404).json({ message: `App ${id} not found` });
	}
});

// ROUTE crUd = update a App
router.put('/:id', async (req, res) => {
	const id = req.params.id;
	// NOTE usually updates tables field
	const update = req.body;

	try {
		// const updatedApp = await App.findByIdAndUpdate(id, update, { new: true });
		// console.log('App updated successfully:', updatedApp);

		// res.status(200).json(updatedApp);

		await App.findByIdAndUpdate(id, update);
		console.log(`App ${id} updated successfully`);

		res.status(204).send();
	} catch (error) {
		console.error('Error while updating app: ', error);

		res.status(500).json({ message: `Failed to update App ${id}` });
	}
});

// ROUTE cruD - delete a App
router.post('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		// const deletedApp = await App.findByIdAndDelete(id);
		// console.log('App deleted successfully', deletedApp);

		// res.status(200).json(deletedApp);

		await App.findByIdAndDelete(id);
		console.log(`App ${id} deleted successfully`);

		res.status(204).send();
	} catch (error) {
		console.error('Error while deleting app: ', error);

		res.status(500).json({ message: `Failed to delete App ${id}` });
	}
});

module.exports = router;
