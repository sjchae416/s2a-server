const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
			passReqToCallback: true,
		},
		async function (req, accessToken, refreshToken, profile, callback) {
			try {
				const email = profile.emails[0].value;
				let user = await User.findOne({ email: email });

				if (user) {
					user.accessToken = accessToken;
					await user.save();

					return callback(null, user);
				} else {
					user = await User.create({
						email: email,
						accessToken: accessToken,
					});

					return callback(null, user);
				}
			} catch (err) {
				console.error(err);
				return callback(err, null);
			}
		}
	)
);

passport.serializeUser((user, callback) => {
	return callback(null, user.email);
});

passport.deserializeUser(async (email, callback) => {
	try {
		const user = await User.findOne({ email: email });

		return callback(null, user);
	} catch (err) {
		return callback(err, null);
	}
});
