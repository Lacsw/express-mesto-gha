const mongoose = require('mongoose');
const { HTTP_STATUS_OK } = require('http2').constants;

const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(HTTP_STATUS_OK).send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    throw new BadRequestError('Невалидный ID');
  }

  User.findById(userId, undefined, { runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователя не существует');
    })
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next, data) => {
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(userId)) {
    throw new BadRequestError('Невалидный ID');
  }

  User.findByIdAndUpdate(userId, data, { runValidators: true, new: true })
    .orFail(() => {
      next(new NotFoundError('Пользователя не существует'));
    })
    .then((newInfo) => {
      res.status(HTTP_STATUS_OK).send(newInfo);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Ошибка валидации'));
      } else {
        next(error);
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const data = {
    name: req.body.name,
    about: req.body.about,
  };
  updateUser(req, res, next, data);
};

const updateUserAvatar = (req, res, next) => {
  const data = {
    avatar: req.body.avatar,
  };
  updateUser(req, res, next, data);
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(userId)) {
    throw new BadRequestError('Невалидный ID');
  }

  User.findById(userId, undefined, { runValidators: true })
    .orFail(() => {
      next(new NotFoundError('Пользователя не существует'));
    })
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  getUserInfo,
};
