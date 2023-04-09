const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const {errors} = require('celebrate');
const router = require('./routes');
const handlerErrors = require('./middlewares/handlerErrors');
const {handlerRequestLogger, handlerErrorLogger} = require('./middlewares/logger');
const {validationCreateUser, validationLogin} = require('./middlewares/validation');
const {createUser, login} = require('./controllers/users');
const {PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb'} = process.env;

const app = express();

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'https://localhost:3000',
  'http://localhost:3000',
  'localhost:3000',
  'https://api.natali.nomoredomains.monster',
  'http://api.natali.nomoredomains.monster',
  'https://natali.nomoredomains.monster',
  'http://natali.nomoredomains.monster',
  'api.natali.nomoredomains.monster',
  'natali.nomoredomains.monster'
];

const corsFunction = {
  origin: function (origin, callback) {
    console.log(origin);
    if (allowedCors.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
};

async function connect() {
  try {
    await mongoose.set('strictQuery', false);
    console.log(`connecting to ${MONGO_URL}`);
    await mongoose.connect(MONGO_URL);
    console.log(`server connect to ${MONGO_URL}`);
    await app.listen(PORT);
    console.log(`server listen port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
}

require('dotenv').config();

app.use(cors(corsFunction));

app.use(express.json());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(handlerRequestLogger)
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);
app.use(router);
app.use(handlerErrorLogger)
app.use(errors());
app.use(handlerErrors);
connect();