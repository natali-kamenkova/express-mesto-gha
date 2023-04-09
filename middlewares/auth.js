const jwt = require('jsonwebtoken');

const NotAuthError = require('../errors/NotAuthError');

const { JWT_SECRET = 'dev-key' } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  /*if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthError('Необходима авторизация');
  }*/

  //const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(authorization, JWT_SECRET);
  } catch (err) {
    next(new NotAuthError('Необходима авторизация...'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
