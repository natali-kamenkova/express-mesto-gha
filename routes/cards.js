const express = require('express');
const cardRouter = require('express').Router();
const { validationCreateCard, validationCardId } = require('../middlewares/validation');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', express.json(), validationCreateCard, createCard);
cardRouter.delete('/:cardId', validationCardId, deleteCard);
cardRouter.put('/:cardId/likes', validationCardId, likeCard);
cardRouter.delete('/:cardId/likes', validationCardId, dislikeCard);

module.exports = cardRouter;
