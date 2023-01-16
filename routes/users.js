const express = require('express');
const userRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
  /* createUser, */
} = require('../controllers/users');

userRouter.get('/', getUsers); // GET /users — возвращает всех пользователей
userRouter.get('/:userId', getUserById); // GET /users/:userId - возвращает пользователя по _id
/* userRouter.post('/', express.json(), createUser); */
userRouter.get('/me', getCurrentUser);
userRouter.patch('/me', express.json(), updateProfile); // PATCH /users/me — обновляет профиль
userRouter.patch('/me/avatar', express.json(), updateAvatar); // PATCH /users/me/avatar — обновляет аватар

module.exports = userRouter;
