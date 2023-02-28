const express = require('express');
const router = express.Router();
const DataSource = require('../models/DataSource');

// ROUTE Crud - create a DataSource
router.post('/:id', async (req, res) => {
	const appId = req.params.id;

	try {
		const newTable = await DataSource.create({ app: appId });
		console.log('New table created successfully: ', newTable);

		res.status(201).json(newTable);
	} catch (error) {
		console.error('Error while creating new table: ', error);

		res
			.status(500)
			.json({ message: `Failed to create new DataSource ${appId}` });
	}
});

// ROUTE cRud - read all Tables
router.get('/', async (req, res) => {
	try {
		const tables = await DataSource.find({});
		console.log('All tables found successfully: ', tables);

		res.status(200).json(tables);
	} catch (error) {
		console.error('Error while creating new table: ', error);

		res.status(404).json({ message: 'Tables not found' });
	}
});

// ROUTE cRud - read a DataSource
router.get('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const table = await DataSource.findById(id);
		console.log('DataSource found: ', table);

		res.status(200).json(table);
	} catch (error) {
		console.error('Error while finding table: ', error);

		res.status(404).json({ message: `DataSource ${id} not found` });
	}
});

// ROUTE crUd = update a DataSource
router.put('/:id', async (req, res) => {
	const id = req.params.id;
	const update = req.body;

	try {
		// const updatedTable = await DataSource.findByIdAndUpdate(id, update, { new: true });
		// console.log('DataSource updated successfully:', updatedTable);

		// res.status(200).json(updatedTable);

		await DataSource.findByIdAndUpdate(id, update);
		console.log(`DataSource ${id} updated successfully`);

		res.status(204).send();
	} catch (error) {
		console.error('Error while updating table: ', error);

		res.status(500).json({ message: `Failed to update DataSource ${id}` });
	}
});

// ROUTE cruD - delete a DataSource
router.post('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		// const deletedTable = await DataSource.findByIdAndDelete(id);
		// console.log('DataSource deleted successfully', deletedTable);

		// res.status(200).json(deletedTable);

		await DataSource.findByIdAndDelete(id);
		console.log(`DataSource ${id} deleted successfully`);

		res.status(204).send();
	} catch (error) {
		console.error('Error while deleting table: ', error);

		res.status(500).json({ message: `Failed to delete DataSource ${id}` });
	}
});

module.exports = router;
