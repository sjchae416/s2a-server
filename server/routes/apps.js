const express = require('express');
const router = express.Router();
const App = require('../models/App');

router.get('/', (req, res) => {
	res.send('This is apps page!');
});

module.exports = router;
