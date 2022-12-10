const mongoose = require('mongoose');

const { Schema } = mongoose;

const cardSchema = new Schema({
  name: { // имя карточки, строка от 2 до 30 символов, обязательное поле
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: { // ссылка на картинку, строка, обязательно поле
    type: String,
    required: true,
  },
  owner: { // ссылка на модель автора карточки, тип ObjectId, обязательное поле
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: { // список, массив ObjectId, по умолчанию — пустой массив (поле default);
    type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  createdAt: { // дата создания, тип Date, значение по умолчанию Date.now.
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
