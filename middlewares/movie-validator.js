const { Joi, celebrate } = require('celebrate');
const { RegExp } = require('../utils/constants');

const addMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(RegExp),
    trailerLink: Joi.string().required().regex(RegExp),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().regex(RegExp),
    movieId: Joi.number().required(),
  }),
});

const movieIdValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  addMovieValidator,
  movieIdValidator,
};
