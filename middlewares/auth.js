const jwt = require('jsonwebtoken');

const NotAuthError = require('../errors/NotAuthError');

const { JWT_SECRET = 'dev-key' } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization /*|| !authorization.startsWith('Bearer ')*/) {
    throw new NotAuthError('Необходима авторизация1');
  }

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDMyZjU1NTkxN2ZhNDAxYWMyMzI1N2YiLCJpYXQiOjE2ODEwNjEyMDYsImV4cCI6MTY4MTY2NjAwNn0.tIokIMHPHHyiwdtj_js0rS7Wg7IL-_I__U3eRf36uKo";
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new NotAuthError('Необходима авторизация2'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
