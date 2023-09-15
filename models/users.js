const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');
const InvalidDataError = require('../errors/invalid-data-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validata: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false, toJSON: { useProjection: true }, toObject: { useProjection: true } });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new InvalidDataError('Неправильный email или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new InvalidDataError('Неправильный email или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
