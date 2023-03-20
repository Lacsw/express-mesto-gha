const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');

const { PORT } = require('./config');

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(cookieParser());

app.use('/', router);

app.listen(PORT, () => {
  console.log('Server started');
});
