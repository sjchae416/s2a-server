const express = require('express');
const router = express.Router();
const View = require('../models/View');

router.get('/', (req, res) => {
	res.send('This is views page!');
});

module.exports = router;
