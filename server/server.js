const dotenv = require('dotenv');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// ROUTE routers
const indexRouter = require('./routes/index');

dotenv.config();
app.use(express.json());

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', (err) => console.error('connection error:', err));

app.use('/', indexRouter);

app.listen(process.env.PORT || 3666, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
