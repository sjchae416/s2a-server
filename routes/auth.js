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
			'email',
			'profile',
			'https://www.googleapis.com/auth/spreadsheets.readonly',
		],
	})
);

router.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect: `http://localhost:${process.env.CLIENT_PORT}/`,
		failureRedirect: '/login/failed',
	})
);

router.get('/login/success', (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: 'Successfully Loged In',
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: 'Not Authorized' });
	}
});

router.get('/login/failed', (req, res) => {
	res.status(401).json({
		error: true,
		message: 'Log in and authentication failed',
	});
});

router.get('/logout', (req, res) => {
	req.logout((error) => {
		if (error) {
			return next(error);
		}
		res.redirect(`http://localhost:${process.env.CLIENT_PORT}/login`);
	});
});

module.exports = router;
