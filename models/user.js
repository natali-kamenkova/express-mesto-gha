const validator = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ // схема пользователя
  name: { // имя пользователя, строка от 2 до 30 символов, обязательное поле
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: { // информация о пользователе, строка от 2 до 30 символов, обязательное поле
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: { // ссылка на аватарку, строка, обязательное поле
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Ссылка должна быть валидной',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
