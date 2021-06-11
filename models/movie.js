const mongoose = require('mongoose');
const validator = require('validator');
const NoRightsError = require('../middlewears/errors/noRightsError');
const NotFoundError = require('../middlewears/errors/notFoundError');

const movieSchema = mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Поле image должно быть Url',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Поле trailer должно быть Url',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Поле thumbnail должно быть Url',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

movieSchema
  .statics.checkMovieOwnerAndDelete = function checkMovieOwnerAndDelete(loggedUserId, movieId) {
    return this.findById(movieId)
      .then((movie) => {
        if (!movie) {
          return Promise.reject(new NotFoundError('Карточка не найдена'));
        }
        if (loggedUserId === String(movie.owner)) {
          return this.findByIdAndRemove(String(movieId))
            .then((deletedMovie) => {
              const curMovie = deletedMovie;
              curMovie.owner = undefined;
              return curMovie;
            });
        }
        return Promise.reject(new NoRightsError('У вас нет прав на удаление этой карточки'));
      });
  };

module.exports = mongoose.model('movie', movieSchema);
