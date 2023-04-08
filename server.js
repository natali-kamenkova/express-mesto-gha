require('dotenv').config();
const { app, MONGO_URL } = require('./app');
const mongoose = require("mongoose");
const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`App connect to dateBase ${MONGO_URL}`);
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

connect();
