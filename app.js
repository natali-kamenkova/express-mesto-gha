const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.get('/', (req, res) => {
  res.send('hello!');
});

app.listen(PORT, () => {
  console.log(`server listen port ${PORT}`);
  console.log(`server connect to ${MONGO_URL}`);
});
