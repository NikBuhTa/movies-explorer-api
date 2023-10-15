const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { NotFoundError } = require('../errors/not-found-error');
const { BadRequestError } = require('../errors/bad-request-error');
const { DataConflictError } = require('../errors/data-conflict-error');
const { InvalidDataError } = require('../errors/invalid-data-error');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Плохой запрос'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => {
          res.status(201).send({ data: user });
        })
        .catch((e) => {
          if (e.code === 11000) {
            next(new DataConflictError('Пользователь с таким email уже существует'));
            return;
          }
          next(e);
        });
    });
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => { throw new NotFoundError('Пользователь не найден'); })
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

// eslint-disable-next-line consistent-return
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    if (user) {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'test-key',
        { expiresIn: '7d' },
      );
      return res.cookie('jwt', `${token}`, {
        httpOnly: true,
        maxAge: 360000,
        sameSite: 'None',
        secure: true,
      }).status(200).send({ message: 'Успешно!' }).end();
    }
  } catch (e) {
    next(e);
  }
};

const logout = (req, res, next) => {
  if (req.cookies.jwt) {
    res.clearCookie('jwt', { httpOnly: true }).send({ message: 'Успешно вышли из аккаунта' });
  }

  next(new InvalidDataError('С токеном что-то не то'));
};

module.exports = {
  createUser,
  updateProfile,
  login,
  logout,
  getUserInfo,
};
