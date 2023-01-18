const express = require('express');
const userRouter = require('express').Router();
const { validationUserId, validationUpdateProfile, validationAvatar } = require('../middlewares/validation');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
  /* createUser, */
} = require('../controllers/users');

userRouter.get('/', getUsers); // GET /users — возвращает всех пользователей
userRouter.get('/me', getCurrentUser);
userRouter.get('/:userId', validationUserId, getUserById); // GET /users/:userId - возвращает пользователя по _id
/* userRouter.post('/', express.json(), createUser); */
userRouter.patch('/me', express.json(), validationUpdateProfile, updateProfile); // PATCH /users/me — обновляет профиль
userRouter.patch('/me/avatar', express.json(), validationAvatar, updateAvatar); // PATCH /users/me/avatar — обновляет аватар

module.exports = userRouter;
