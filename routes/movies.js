const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

function validateUrl(value, helpers) {
  if (!(validator.isURL(value))) return helpers.error('Должно быть Url');
  return value;
}

const {
  findAllMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', findAllMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.number().required().min(1),
    year: Joi.string().required().min(4),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateUrl, 'custom validation'),
    trailer: Joi.string().required().custom(validateUrl, 'custom validation'),
    thumbnail: Joi.string().required().custom(validateUrl, 'custom validation'),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().required().max(24),
  }),
}), deleteMovie);

module.exports = router;
