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

module.exports = { getUsers, getUser, createUser };
