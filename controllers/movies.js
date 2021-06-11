const Movie = require('../models/movie');
const ValidationError = require('../middlewears/errors/validationError');
const CastError = require('../middlewears/errors/castError');
const ConflictError = require('../middlewears/errors/conflictError');

const findAllMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner: `${owner}` })
    .then((movies) => {
      let catalogMovies = [];
      if (movies.length !== 0) {
        catalogMovies = movies.map((movie) => {
          const curMovie = movie;
          curMovie.owner = undefined;
          return curMovie;
        });
      }
      res.send({ data: catalogMovies });
    })
    .catch((err) => next(err))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country, director, duration, year, description, image,
    trailer, thumbnail, movieId, nameRU, nameEN,
  } = req.body;

  Movie.findOne({ movieId: `${movieId}`, owner: `${owner}` })
    .then((data) => {
      if (data === null) {
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
          nameEN,
          owner,
        })
          .then((movie) => {
            const addedMovieInfo = movie;
            addedMovieInfo.owner = undefined;
            res.send({ data: addedMovieInfo });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              throw new ValidationError(err.message);
            } else {
              next(err);
            }
          })
          .catch(next);
      } else {
        next(new ConflictError('Такой фильм уже содержится в Вашем списке'));
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.checkMovieOwnerAndDelete(req.user._id, req.params.movieId, next)
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Введенный ID не подходит по длине'));
      }
      next(err);
    });
};

module.exports = {
  findAllMovies,
  createMovie,
  deleteMovie,
};
