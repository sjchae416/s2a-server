const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/token', (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: 'Successfully fetched access token',
			accessToken: req.user.accessToken,
		});
	} else {
		res.status(403).json({ error: true, message: 'Not Authorized' });
	}
});

router.get(
	'/google',
	passport.authenticate('google', {
		scope: [
			'profile',
			'email',
			'https://www.googleapis.com/auth/spreadsheets.readonly',
		],
	})
);

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: 'http://localhost:3000/login',
	}),
	(req, res) => {
		res.redirect('http://localhost:3000/');
	}
);

router.get('/authenticated', (req, res) => {
	if (req.user) {
		console.log("user exists");
		res.json(req.user);
	} else {
		console.log("user doesn't exist");
		res.json(null);
	}
});

router.get('/logout', (req, res) => {
	req.logout((error) => {
		if (error) {
			return next(error);
		}
		res.redirect('http://localhost:3000/login');
	});
});

module.exports = router;
