const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { centralErrorHandle } = require('./middlewears/centralErrorHandle');
const { requestLogger, errorLogger } = require('./middlewears/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/filmdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use('/', router);

app.use((req, res) => {
  res.status(404).send({ message: 'ошибка 404: такой страницы не существует' });
});

app.use(errorLogger);

app.use(errors());

app.use(centralErrorHandle);

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
