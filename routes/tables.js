const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const View = require('../models/View');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).json({ error: true, message: 'Not authorized' });
}

function extractSheetId(url) {
	const regex = /spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
	const match = url.match(regex);

	if (match && match.length > 1) {
		return match[1];
	} else {
		return null;
	}
}

async function getUserSheetsData(sheetId, sheetIndex, accessToken) {
	const oauth2Client = new OAuth2();
	oauth2Client.setCredentials({ access_token: accessToken });
	const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
	const spreadsheetId = sheetId;
	const range = sheetIndex;

	try {
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range,
		});

		const rows = response.data.values;
		return rows;
	} catch (error) {
		console.log("Error accessing user's Google Sheet:", error);
		return null;
	}
}

// ROUTE Crud - load table values
router.post('/loadtable', ensureAuthenticated, async (req, res) => {
	const { name, url, sheetIndex } = req.body;
	const rows = await getUserSheetsData(
		extractSheetId(url),
		sheetIndex,
		req.user.accessToken
	);
	res.send(rows);
});

// ROUTE Crud - create a Table
router.post('/', async (req, res) => {
	const { name, url, sheetIndex, config } = req.body;

	try {
		const newTable = await Table.create({
			name: name,
			url: url,
			sheetIndex: sheetIndex,
			columns: config,
		});
		console.log('New Table created successfully: ', newTable);

		res.status(201).json(newTable);
	} catch (error) {
		console.error('Error while creating new Table: ', error);

		// REVIEW this will send specific error msg for duplicate key
		if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
			res.status(400).json({
				message: 'The table name already exists!',
				code: error.code,
				keyPattern: error.keyPattern,
			});
		} else {
			res.status(500).json({ message: `Failed to create new Table ${name}` });
		}
	}
});

// ROUTE cRud - read all Tables
router.get('/', async (req, res) => {
	try {
		const tables = await Table.find({});
		console.log('All tables found successfully: ', tables);

		res.status(200).json(tables);
	} catch (error) {
		console.error('Error while creating new Table: ', error);

		res.status(404).json({ message: 'Tables not found' });
	}
});

// ROUTE cRud - read a Table
router.get('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const table = await Table.findById(id);
		console.log('Table found: ', table);

		res.status(200).json(table);
	} catch (error) {
		console.error('Error while finding Table: ', error);

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
		console.error('Error while updating Table: ', error);

		res.status(500).json({ message: `Failed to update Table ${id}` });
	}
});

// ROUTE cruD - delete a Table
router.delete('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		// const deletedTable = await Table.findByIdAndDelete(id);
		// console.log('Table deleted successfully', deletedTable);

		// res.status(200).json(deletedTable);

		await View.deleteMany({ table: id });
		console.log(`All Views with Table ${id} deleted successfully`);

		await Table.findByIdAndDelete(id);
		console.log(`Table ${id} deleted successfully`);

		res.status(204).send();
	} catch (error) {
		console.error('Error while deleting Table: ', error);

		res.status(500).json({ message: `Failed to delete Table ${id}` });
	}
});

module.exports = router;
