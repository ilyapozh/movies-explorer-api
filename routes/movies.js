const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  findAllMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', findAllMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.string().required().min(1),
    year: Joi.string().required().min(4),
    description: Joi.string().required(),
    image: Joi.string().required().uri(),
    trailer: Joi.string().required().uri(),
    thumbnail: Joi.string().required().uri(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    owner: Joi.string(),
  }),
}), createMovie);

router.delete('/:movieId', deleteMovie);

module.exports = router;
