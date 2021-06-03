const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
const { centralErrorHandle } = require('./middlewears/centralErrorHandle');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/filmdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/', router);

app.use(centralErrorHandle);

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
