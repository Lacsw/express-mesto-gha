const http2 = require('http2');
const mongoose = require('mongoose');

const User = require('../models/user');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(HTTP_STATUS_OK).send(users);
    })
    .catch((error) => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера ${error}` });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Невалидный ID' });
    return;
  }

  User.findById(userId, undefined, { runValidators: true })
    .orFail(() => {
      res
        .status(HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Пользователя не существует' });
    })
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((error) => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера ${error}` });
    });
};

const updateUser = (req, res, data) => {
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(userId)) {
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Невалидный ID' });
    return;
  }

  User.findByIdAndUpdate(userId, data, { runValidators: true, new: true })
    .orFail(() => {
      res.status(HTTP_STATUS_NOT_FOUND).send({
        message: `Пользователь c ID:${userId} не найден`,
      });
    })
    .then((newInfo) => {
      res.status(HTTP_STATUS_OK).send(newInfo);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные.',
        });
        return;
      }
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера ${error}` });
    });
};

const updateUserInfo = (req, res) => {
  const data = {
    name: req.body.name,
    about: req.body.about,
  };
  updateUser(req, res, data);
};

const updateUserAvatar = (req, res) => {
  const data = {
    avatar: req.body.avatar,
  };
  updateUser(req, res, data);
};

const getUserInfo = (req, res) => {
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(userId)) {
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Невалидный ID' });
    return;
  }

  User.findById(userId, undefined, { runValidators: true })
    .orFail(() => {
      res
        .status(HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Пользователя не существует' });
    })
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((error) => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports = {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  getUserInfo,
};
