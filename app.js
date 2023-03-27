const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');

const router = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT } = require('./config');

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server started');
});
