const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');
const { NotFoundError } = require('../errors/not-found-error');

router.use(userRouter);
router.use(movieRouter);
router.use((req, res, next) => { next(new NotFoundError('Такой страницы не существует!')); });

module.exports = router;
