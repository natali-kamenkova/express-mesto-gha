const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const router = require('./routes');
const handlerErrors = require('./middlewares/handlerErrors');
const { handlerRequestLogger, handlerErrorLogger } = require('./middlewares/logger');
const { validationCreateUser, validationLogin } = require('./middlewares/validation');
const { createUser, login } = require('./controllers/users');
const { MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

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

require('dotenv').config();

app.use(cors(function (origin, callback) {
  console.log(origin);
  if (allowedCors.indexOf(origin) !== -1 || !origin) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);
app.use(handlerRequestLogger)
app.use(router);
app.use(handlerErrorLogger)
app.use(errors());
app.use(handlerErrors);
module.exports = { app, MONGO_URL };