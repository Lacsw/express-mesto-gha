const http2 = require('http2');
const User = require('../models/user');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Нет пользователей' });
        return;
      }
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

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователя не существует' });
      }
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Пользователь c ID:${userId} не найден`,
        });
        return;
      }
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера ${error}` });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => res.status(HTTP_STATUS_CREATED).send(newUser))
    .catch((error) => {
      if (error.name === 'ValidationError') {
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

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { runValidators: true, new: true }
  )
    .then((newInfo) => {
      res.status(HTTP_STATUS_OK).send(newInfo);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
        return;
      }
      if (error.name === 'CastError') {
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: `Пользователь c ID:${userId} не найден`,
        });
        return;
      }
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера ${error}` });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { runValidators: true, new: true })
    .then((newAvatar) => res.status(HTTP_STATUS_OK).send(newAvatar))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
        return;
      }
      if (error.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: `Пользователь c ID:${userId} не найден`,
        });
        return;
      }
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
