const http2 = require('http2');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

const { SECRET_WORD, NODE_ENV } = require('../config');
const { MONGO_DUPLICATE_CODE } = require('../utils/constants');

const { HTTP_STATUS_CREATED } = http2.constants;

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? SECRET_WORD : 'dev-secret',
        {
          expiresIn: '7d',
        }
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .send({ token });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((newUser) => res.status(HTTP_STATUS_CREATED).send(newUser.toJSON()))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(error.message));
      } else if (error.code === MONGO_DUPLICATE_CODE) {
        next(new ConflictError('Пользователь с такой почтой уже существует.'));
      } else {
        next(error);
      }
    });
};

module.exports = { createUser, login };
