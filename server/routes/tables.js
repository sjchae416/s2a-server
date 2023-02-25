const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

// ROUTE Crud - create a Table
router.post('/:id', async (req, res) => {
	const appId = req.params.id;

	try {
		const newTable = await Table.create({ app: appId });
		console.log('New table created successfully: ', newTable);

		res.status(201).json(newTable);
	} catch (error) {
		console.error('Error while creating new table: ', error);

		res.status(500).json({ message: `Failed to create new Table ${appId}` });
	}
});

// ROUTE cRud - get all Tables
router.get('/', async (req, res) => {
	try {
		const tables = await Table.find({});
		console.log('All tables found successfully: ', tables);

		res.status(200).json(tables);
	} catch (error) {
		console.error('Error while creating new table: ', error);

		res.status(404).json({ message: 'Tables not found' });
	}
});

// ROUTE cRud - get a Table
router.get('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const table = await Table.findById(id);
		console.log('Table found: ', table);

		res.status(200).json(table);
	} catch (error) {
		console.error('Error while finding table: ', error);

		res.status(404).json({ message: `Table ${id} not found` });
	}
});

// ROUTE crUd = update a Table
router.put('/:id', async (req, res) => {
	const id = req.params.id;
	const update = req.body;

	try {
		// const updatedTable = await Table.findByIdAndUpdate(id, update, { new: true });
		// console.log('Table updated successfully:', updatedTable);

		// res.status(200).json(updatedTable);

		await Table.findByIdAndUpdate(id, update);
		console.log(`Table ${id} updated successfully`);

		res.status(204).send();
	} catch (error) {
		console.error('Error while updating table: ', error);

		res.status(500).json({ message: `Failed to update Table ${id}` });
	}
});

// ROUTE cruD - delete a Table
router.post('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		// const deletedTable = await Table.findByIdAndDelete(id);
		// console.log('Table deleted successfully', deletedTable);

		// res.status(200).json(deletedTable);

		await Table.findByIdAndDelete(id);
		console.log(`Table ${id} deleted successfully`);

		res.status(204).send();
	} catch (error) {
		console.error('Error while deleting table: ', error);

		res.status(500).json({ message: `Failed to delete Table ${id}` });
	}
});

module.exports = router;
