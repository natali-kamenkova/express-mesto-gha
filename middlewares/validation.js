const { celebrate, Joi } = require('celebrate');

const isUrl = require('validator/lib/isURL');
const BadRequest = require('../errors/BadRequest'); // 400
// валидания ссылок
const validationUrl = (url) => {
  const validate = isUrl(url);
  if (validate) {
    return url;
  }
  throw new BadRequest('Некорректный адрес URL');
};

module.exports.validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validationCreateUser = celebrate({ // POST /signup — создаёт пользователя
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/http[s]?:\/\/(?:www\.)?([\w-]+\.)+\/?\S*$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/http[s]?:\/\/(?:www\.)?([\w-]+\.)+\/?\S*$/),
  }),
});

module.exports.validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});

module.exports.validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

module.exports.validationUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});
/*
module.exports.validationAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/http[s]?:\/\/(?:www\.)?([\w-]+\.)+\/?\S*$/),
  }),
}); */
module.exports.validationAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validationUrl),
  }),
});
