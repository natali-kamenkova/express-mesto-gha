const jwt = require('jsonwebtoken');

const NotAuthError = require('../errors/NotAuthError');

const { JWT_SECRET = 'dev-key' } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization/* || !authorization.startsWith('Bearer ')*/) {
    throw new NotAuthError('Необходима авторизация 1');
  }
  let token = ""
  if (authorization.startsWith('Bearer ')) {
    token = authorization.replace('Bearer ', '');
  } else {
    authorization;
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new NotAuthError('Необходима авторизация 2'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
