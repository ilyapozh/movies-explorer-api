const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { auth } = require('../middlewears/auth');
const { createUser, login } = require('../controllers/users');

router.post('/signup', createUser);

router.post('/signin', login);

router.use('/users', auth, usersRouter);

router.use('/movies', auth, moviesRouter);

module.exports = router;
