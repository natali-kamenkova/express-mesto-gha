const express = require('express');
const userRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', express.json(), createUser);
userRouter.patch('/me', express.json(), updateProfile);
userRouter.patch('/me/avatar', express.json(), updateAvatar);

module.exports = userRouter;
