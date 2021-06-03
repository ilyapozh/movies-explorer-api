const mongoose = require('mongoose');
const validator = require('validator');

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
    type: String,
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
    unique: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEn: {
    type: String,
    required: true,
  },
});

movieSchema.statics.checkMovieOwner = function (loggedUserId, moovieId) {
  return this.findById(moovieId)
    .then((movie) => {
      if (!movie) {
        return Promise.reject(new Error('NotFound'));
      }
      if (loggedUserId === String(movie.owner)) {
        return this.findByIdAndRemove(String(moovieId))
          .then(() => console.log('delete complete'));
      }
      return Promise.reject(new Error('NoRights'));
    });
};

module.exports = mongoose.model('movie', movieSchema);
