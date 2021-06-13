const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');
const helmet = require('helmet');
const router = require('./routes/index');
const { centralErrorHandle } = require('./middlewears/centralErrorHandle');
const { requestLogger, errorLogger } = require('./middlewears/logger');

const { PORT = 3000 } = process.env;
const { DB_ADRESS = 'mongodb://localhost:27017/filmdb' } = process.env;

const app = express();

app.use(helmet());

app.use(express.json());

mongoose.connect(DB_ADRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(centralErrorHandle);

app.listen(PORT, () => {});
