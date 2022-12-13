const Card = require('../models/card');
const {
  OK,
  BAD_REQUES,
  NOT_FOUND,
  SERVER_ERROR,
  CREATED,
} = require('../constants');

// создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUES).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

// получение всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

// удаление карточки
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }

      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUES).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

// лайки
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail(new Error('NotFound'))
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.message === 'NotFound') {
      return res.status(NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
    }
    if (err.name === 'CastError') {
      return res.status(BAD_REQUES).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
  });

// дизлайки
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail(new Error('NotFound'))
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.message === 'NotFound') {
      return res.status(NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
    }
    if (err.name === 'CastError') {
      return res.status(BAD_REQUES).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
  });
