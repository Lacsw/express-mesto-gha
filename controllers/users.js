const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res.status(404).send({ message: `Нет пользователей` });
        return;
      }
      res.status(200).send(users);
    })
    .catch((error) => {
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      console.log(user);
      if (!user) {
        res.status(404).send({ message: `Пользователя не существует` });
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(400).send({
          message: `Пользователь c ID:${userId} не найден`,
        });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => res.status(200).send(newUser))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(400).send({ message: `Ошибка валидации` });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
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
      res.status(200).send(newInfo);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(400)
          .send({
            message: `Переданы некорректные данные при обновлении профиля.`,
          });
        return;
      }
      if (error.name === "CastError") {
        res.status(404).send({
          message: `Пользователь c ID:${userId} не найден`,
        });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { runValidators: true, new: true })
    .then((newAvatar) => res.status(200).send(newAvatar))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные при обновлении аватара.`,
        });
        return;
      }
      if (error.name === "CastError") {
        res.status(400).send({
          message: `Пользователь c ID:${userId} не найден`,
        });
        return;
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
