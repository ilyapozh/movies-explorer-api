const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ValidationError = require('../middlewears/errors/validationError');
const MongoError = require('../middlewears/errors/MongoError');
const NotFoundError = require('../middlewears/errors/notFoundError');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;

  let { password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      password = hash;
      User.create({
        name, email, password,
      })
        .then((user) => {
          user.password = undefined;
          res.send({ data: user });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new ValidationError(`В отправленных данных есть ошибка ${err.message}`);
          }
          if (err.code === 11000) {
            throw new MongoError('Пользователь с таким имейлом уже существует');
          } else {
            next(err);
          }
        })
        .catch(next);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ user, token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.getCurrentUserInfo(req.user._id)
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  //! Работает только если оба параметра новые
  User.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .orFail(() => {
      next(new NotFoundError('Ошибка в ID'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`В отправленных данных есть ошибка ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  createUser,
  login,
};
