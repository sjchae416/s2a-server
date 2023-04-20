require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
// REVIEW from sj's cse316
// NOTE npm install connect-mongo
// const MongoStore = require('connect-mongo');
// REVIEW from sj's cse316
const session = require('express-session');
const passport = require('passport');
// const passportStrategy = require('./passport');
require('./passport2');

// ROUTE routers
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const appRouter = require('./routes/apps');
const viewRouter = require('./routes/views');
const tableRouter = require('./routes/tables');
// const authRouter = require('./routes/authBackup');
const authRouter = require('./routes/auth2');
// const authRouter = require('./routes/auth');

app.use(express.json());

// REVIEW from sj's cse316
// const store = MongoStore.create({                   // NOTE creates a new session store that uses MongoDB to store the session data.
// 	mongoUrl: mongoDB,                                // NOTE specifies the connection URL
// 	secret: process.env.SESSION_SECRET,               // NOTE specifies the secret key
// 	touchAfter: 24 * 60 * 60,                         // NOTE specifies time (in s) after which a session should be updated (even not modified)
// });
// REVIEW from sj's cse316

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
app.use('/', indexRouter);
app.get(
	`http://localhost:${process.env.CLIENT_PORT}/server/port`,
	(req, res) => {
		res.json({ port: process.env.PORT });
	}
);
app.use('/users', userRouter);
app.use('/apps', appRouter);
app.use('/tables', tableRouter);
app.use('/views', viewRouter);
app.use('/auth', authRouter);
app.get('*', (req, res) => {
	res.status(404).json({ message: '404 Page Not Found' });
});

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
