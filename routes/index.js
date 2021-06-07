const { Joi, celebrate } = require('celebrate');
const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { auth } = require('../middlewears/auth');
const { createUser, login } = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), login);

router.use('/users', auth, usersRouter);

router.use('/movies', auth, moviesRouter);

module.exports = router;