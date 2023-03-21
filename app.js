const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const router = require('./routes/index');

const { PORT } = require('./config');

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(cookieParser());

app.use('/', router);

app.listen(PORT, () => {
  console.log('Server started');
});
