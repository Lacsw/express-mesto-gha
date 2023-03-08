const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const { PORT, DATABASE_URL } = require('./config');

const app = express();
mongoose.connect(DATABASE_URL);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6404abf703625ca6cc1575a1',
  };
  next();
});
app.use('/', router);

app.listen(PORT, () => {
  console.log('Server started');
});
