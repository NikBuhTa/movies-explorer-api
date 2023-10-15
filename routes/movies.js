const express = require('express');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { addMovieValidator, movieIdValidator } = require('../middlewares/movie-validator');

const movieRouter = express.Router();

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', addMovieValidator, createMovie);
movieRouter.delete('/movies/:movieId', movieIdValidator, deleteMovie);

module.exports = movieRouter;
