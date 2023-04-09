const jwt = require('jsonwebtoken');

const NotAuthError = require('../errors/NotAuthError');

const { JWT_SECRET = 'dev-key' } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthError('Необходима авторизация1');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new NotAuthError('Необходима авторизация2'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
