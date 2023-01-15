const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

const { JWT_SECRET = 'dev-key' } = process.env;

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

// создание пользователя
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!req.body.email || !req.body.password) {
    res.status(BAD_REQUEST).send({ message: 'Не передан email или пароль' });
  }
  bcrypt.hash(password, SALT)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
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
module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).send({ message: 'Не правильный email или password' });
  }
  try {
    const user = await User.findOne({ email })
      .select('+password');
    if (!user) {
      return res.status(401).send({ message: 'Не правильный email или password' });
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).send({ message: 'Не правильный email или password' });
    }
    const token = jwt.sign( // создание токена если была произведена успешная авторизация
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }, // токен будет просрочен через неделю после создания
    );
    return res.status(200).send({ message: 'Добро пожаловать', token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Не удалось авторизоваться' });
  }
  return res.status(200).send({ message: 'Добро пожаловать' });
};
