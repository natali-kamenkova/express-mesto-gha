const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const router = require('./routes');
const handlerErrors = require('./middlewares/handlerErrors');
const { validationCreateUser, validationLogin } = require('./middlewares/validation');
const { createUser, login } = require('./controllers/users');
const { MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
require('dotenv').config();

app.use(cors())
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
app.use(router);
app.use(errors());
app.use(handlerErrors);
module.exports = { app, MONGO_URL };