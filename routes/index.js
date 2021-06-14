const { Joi, celebrate } = require('celebrate');
const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { auth } = require('../middlewears/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../middlewears/errors/notFoundError');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.use('/users', auth, usersRouter);

router.use('/movies', auth, moviesRouter);

router.use(auth, (req, res, next) => {
  next(new NotFoundError('ошибка 404: такой страницы не существует'));
});

module.exports = router;
