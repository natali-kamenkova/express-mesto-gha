const express = require('express');

const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use((req, res, next) => { // временное решение
  req.user = {
    _id: '63959cdea6ddf98a586a85c1',
  };

  next();
});

async function connect() {
  try {
    await mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URL);
    console.log(`server connect to ${MONGO_URL}`);
    await app.listen(PORT);
    console.log(`server listen port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
}
// _id: 63959cdea6ddf98a586a85c1

app.use(router);
connect();
