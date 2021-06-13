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
          const currentUserInfo = user;
          currentUserInfo.password = undefined;
          res.send({ data: currentUserInfo });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new ValidationError(`В отправленных данных есть ошибка ${err.message}`);
          }
          if (err.code === 11000 && err.name === 'MongoError') {
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
      const currentUserInfo = user;
      currentUserInfo.password = undefined;
      res.send({ token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.getCurrentUserInfo(req.user._id)
    .then((user) => {
      const currentUserInfo = user;
      currentUserInfo.password = undefined;
      res.send({ currentUserInfo });
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .orFail(() => new NotFoundError('Ошибка в ID'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(`В отправленных данных есть ошибка ${err.message}`));
      }
      if (err.code === 11000 && err.name === 'MongoError') {
        return next(new MongoError('Пользователь с таким имейлом уже существует'));
      }
      return next(err);
    });
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  createUser,
  login,
};
