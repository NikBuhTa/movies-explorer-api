const { AccessDeniedError } = require('../errors/access-denied-error');
const { BadRequestError } = require('../errors/bad-request-error');
const { NotFoundError } = require('../errors/not-found-error');
const Movie = require('../models/movies');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(() => { throw new NotFoundError('Сохраненных фильмов нет'); })
    .populate(['owner'])
    .then((movies) => res.status(200).send({ data: movies }))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Неправильный запрос'));
      }
      next(e);
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const id = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: id,
  })
    .then((movie) => movie.populate(['owner']))
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Неправильный запрос'));
      }
      next(e);
    });
};

const deleteMovie = (req, res, next) => {
  const id = req.params.movieId;
  Movie.findById(id)
    .populate(['owner'])
    .orFail(() => { throw new NotFoundError('Фильм не найден'); })
    .then((c) => {
      const ownerId = c.owner._id.toString().replace(/ObjectId\("(.*)"\)/, '$1');
      if (!(ownerId === req.user._id)) {
        throw new AccessDeniedError('Вы не можете удалить не свой фильм!');
      }
      Movie.deleteOne(c)
        .then((movie) => res.status(200).send({ data: movie }));
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Неправильный запрос'));
      }
      next(e);
    });
};
//     });
// };

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
