const Movie = require('../models/movie');
const ValidationError = require('../middlewears/errors/validationError');
const MongoError = require('../middlewears/errors/MongoError');
const NotFoundError = require('../middlewears/errors/notFoundError');
const CastError = require('../middlewears/errors/castError');
const NoRightsError = require('../middlewears/errors/noRightsError');

const findAllMovies = (req, res, next) => {
  Movie.find({}) // add populate('owner') to work
    .then((movies) => {
      // if (movies.length === 0) {
      //   throw new NotFoundError('Карточки не найдены');
      // } !!! Should there be a special response for no-movies case ???
      res.send({ data: movies });
    })
    .catch((err) => next(err))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country, director, duration, year, description, image,
    trailer, thumbnail, movieId, nameRU, nameEn,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEn,
    owner,
  })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      } if (err.code === 11000) {
        throw new MongoError('Такой фильм уже существует в Вашем списке.');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.checkMovieOwner(req.user._id, req.params.movieId)
    .then(() => {
      Movie.find({})
        .then((movies) => res.send({ data: movies }));
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Карточка не найдена');
      } else if (err.name === 'CastError') {
        throw new CastError('Ошибка в ID');
      } else if (err.message === 'NoRights') {
        throw new NoRightsError('Нет прав');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports = {
  findAllMovies,
  createMovie,
  deleteMovie,
};
