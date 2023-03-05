const Card = require("../models/card");

const getCards = async (req, res) => {
  const cards = await Card.find({});

  try {
    res.send(cards);
  } catch (error) {
    res.status(500).send({ message: `Ошибка сервера ${error}` });
  }
};

const createCard = async (req, res) => {
  const { name, link, owner, likes, createdAt } = req.body;
  const newCard = await Card.create({ name, link, owner, likes, createdAt });

  try {
    res.send(newCard);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).send({ message: `Ошибка валидации` });
      return;
    }
    res.status(500).send({ message: `Ошибка сервера ${error}` });
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const deletedCard = await Card.findByIdAndDelete(cardId);

  try {
    res.send(deletedCard);
  } catch (error) {
    console.log(error);
    res.send(error.status);
    res.send(error.message);
  }
};

const likeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const likedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    res.send(likedCard);
  } catch (error) {
    if (error.name === "CastError") {
      res.status(400).send({ message: `Карточка c ID:${cardId} не найдена` });
      return;
    }
    if (error.name === "ValidationError") {
      res.status(400).send({ message: `Переданы некорректные данные.` });
      return;
    }
    res.status(500).send({ message: `Ошибка сервера ${error}` });
  }
};

const dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const likedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true }
    );

    res.send(likedCard);
  } catch (error) {
    if (error.name === "CastError") {
      res.status(400).send({ message: `Карточка c ID:${cardId} не найдена` });
      return;
    }
    if (error.name === "ValidationError") {
      res.status(400).send({ message: `Переданы некорректные данные.` });
      return;
    }
    res.status(500).send({ message: `Ошибка сервера ${error}` });
  }
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
