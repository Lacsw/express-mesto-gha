const http2 = require('http2');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { SECRET_WORD } = require('../config');

const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_WORD, {
        expiresIn: '7d',
      });

      res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true }).send(token);
    })
    .catch((err) => {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((newUser) => res.status(HTTP_STATUS_CREATED).send(newUser.toJSON()))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Ошибка валидации' });
        return;
      }
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports = { createUser, login };
