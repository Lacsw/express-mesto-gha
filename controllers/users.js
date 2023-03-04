const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((error) => {
      console.log(error);
      res.send(error.status);
      res.send(error.message);
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.send(user))
    .catch((error) => {
      console.log(error);
      res.send(error.status);
      res.send(error.message);
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => res.send(newUser))
    .catch((error) => {
      console.log(error);
      res.send(error.status);
      res.send(error.message);
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((newInfo) => res.send(newInfo))
    .catch((error) => {
      console.log(error);
      res.send(error.status);
      res.send(error.message);
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((newAvatar) => res.send(newAvatar))
    .catch((error) => {
      console.log(error);
      res.send(error.status);
      res.send(error.message);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
