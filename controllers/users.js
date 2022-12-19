const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  SALT,
  CREATED,
  MONGO_DUPLICATE_ERROR_CODE,
} = require('../constants');

// получение всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

// получение пользователя по Id
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};
/*
// создание пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
}; */

// создание пользователя
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!req.body.email || !req.body.password) {
    res.status(BAD_REQUEST).send({ message: 'Не передан email или пароль' });
  }
  bcrypt.hash(password, SALT)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.status(CREATED).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      email: user.email,
    }))

    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
        return res.status(409).send({ message: 'Пользователь с таким email уже существует' });
      }
      console.log(error.name);
      return res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};
/*
module.exports.createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name, about, avatar }))
    .then((user) =>
      res.send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
        __v: user.__v,
      }))
    .catch((error) => {
      if (error.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
      } else if (error.name === 'ValidationError') {
        next(new BadRequest(`${error.message.split('-')[1]}`));
      } else {
        next(error);
      }
    });
} */
// изменение профиля
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => { res.send({ name: user.name, about: user.about }); })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с таким id не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

// изменение аватара
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с таким id не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};
