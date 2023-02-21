const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.send('Routing is working!');
});

module.exports = router;
