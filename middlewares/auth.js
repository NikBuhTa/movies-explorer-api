const jwt = require('jsonwebtoken');
const InvalidDataError = require('../errors/invalid-data-error');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  let payload;
  const token = req.cookies.jwt;

  if (!token) {
    next(new InvalidDataError('Неверный токен'));
  }

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'test-key');
  } catch (e) {
    next(new InvalidDataError('Неверный токен'));
  }
  req.user = payload;
  next();
};
