require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./passport');

// ROUTE routers
const userRouter = require('./routes/users');
const appRouter = require('./routes/apps');
const viewRouter = require('./routes/views');
const tableRouter = require('./routes/tables');
const googleapisRouter = require('./routes/googleapis');
const authRouter = require('./routes/auth');

app.use(express.json());

// User session
app.use(
	session({
		// store,
		name: 'passportSession',
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true, // NOTE specifies that the cookie should only be sent over HTTP, not through client-side JS
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // NOTE sets the expiration time of the cookie to one week from the current time
			maxAge: 1000 * 60 * 60 * 24 * 7, // NOTE sets the maximum age of the cookie to one week from the current time
		},
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: 'http://localhost:3000',
		methods: 'POST, GET, PUT, DELETE',
		credentials: true,
	})
);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', (err) => console.error('connection error:', err));

// NOTE router endpoint modules
app.use('/users', userRouter);
app.use('/apps', appRouter);
app.use('/tables', tableRouter);
app.use('/views', viewRouter);
app.use('/auth', authRouter);
app.use('/googleapis', googleapisRouter);
app.get('*', (req, res) => {
	res.status(404).json({ message: '404 Page Not Found' });
});

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
