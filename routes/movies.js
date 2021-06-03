const router = require('express').Router();
const {
  findAllMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', findAllMovies);

router.post('/', createMovie);

router.delete('/:movieId', deleteMovie);

module.exports = router;
