const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6404abf703625ca6cc1575a1',
  };
  next();
});

app.use('/', router);

app.listen(3000, () => {
  console.log('Server started');
});
