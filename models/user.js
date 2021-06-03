const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const TokenError = require('../middlewears/errors/tokenError');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Поле email должно быть email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 2,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      if (!user) {
        throw new TokenError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new TokenError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

userSchema.statics.getCurrentUserInfo = function (userId) { // can change to orFail the if statement
  return this.findById(userId).select('+password') // this select doesn't work
    .then((user) => {
      if (!user) {
        throw new TokenError('Такого пользователя не существует');
      } else {
        return user;
      }
    });
};

module.exports = mongoose.model('user', userSchema);
