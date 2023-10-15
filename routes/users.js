const express = require('express');
const {
  getUserInfo, updateProfile,
} = require('../controllers/users');
const { updateUserInfoValidator } = require('../middlewares/user-validation');

const userRouter = express.Router();

userRouter.get('/users/me', getUserInfo);
userRouter.patch('/users/me', updateUserInfoValidator, updateProfile);
module.exports = userRouter;
