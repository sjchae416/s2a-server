require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');


// ROUTE routers
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const appRouter = require('./routes/apps');
const viewRouter = require('./routes/views');
const tableRouter = require('./routes/tables');
const authRouter = require('./routes/auth');

app.use(express.json());

// User session
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', (err) => console.error('connection error:', err));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/apps', appRouter);
app.use('/tables', tableRouter);
app.use('/views', viewRouter);
app.use('/auth', authRouter);
app.use('*', (req, res) => {
  res.status(404).json({ message: '404 Page Not Found' });
});

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});


module.exports = app;