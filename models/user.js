const validator = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ // схема пользователя
  name: { // имя пользователя, строка от 2 до 30 символов, обязательное поле
    type: String,
    required: [true, 'Поле обязательно'],
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 30 символов'],
  },
  about: { // информация о пользователе, строка от 2 до 30 символов, обязательное поле
    type: String,
    required: [true, 'Поле обязательно'],
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Маимальная длина 30 символов'],
  },
  avatar: { // ссылка на аватарку, строка, обязательное поле
    type: String,
    required: [true, 'Поле обязательно'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Ссылка должна быть валидной',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
