const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.send('This is a home page!');
});

// FIXME not working, not used yet
// TODO return PORT to the client
router.get('http://localhost:3000/server-port', (req, res) => {
	res.json({ port: process.env.PORT });
});

module.exports = router;
