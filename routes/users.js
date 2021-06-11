const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getUserInfo, updateUserInfo,
} = require('../controllers/users');

router.get('/me', getUserInfo);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(10),
    email: Joi.string().required().email(),
  }),
}), updateUserInfo);

module.exports = router;
