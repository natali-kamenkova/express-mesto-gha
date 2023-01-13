const validator = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ // схема пользователя
  name: { // имя пользователя, строка от 2 до 30 символов, обязательное поле
    type: String,
    required: false,
    minlength: 2,
    maxlength: [30, 'Максимальная длина 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: { // информация о пользователе, строка от 2 до 30 символов, обязательное поле
    type: String,
    required: false,
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Маимальная длина 30 символов'],
    default: 'Исследователь',
  },
  avatar: { // ссылка на аватарку, строка, обязательное поле
    type: String,
    required: false,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Ссылка должна быть валидной',
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: { // почта пользователя, уникальное значение
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Почта должна быть валидной!',
      },
    },
    password: { // пароль пользователя для входа
      type: String,
      required: true,
      select: false, // хеш пароля пользователя не будет возвращаться из базы
    },
  },
});

module.exports = mongoose.model('user', userSchema);
