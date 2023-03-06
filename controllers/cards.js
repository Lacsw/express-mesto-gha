const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (error) {
    res.status(500).send({ message: `Ошибка сервера ${error}` });
  }
};

const createCard = async (req, res) => {
  const {
    name, link, owner, likes, createdAt,
  } = req.body;

  try {
    const newCard = await Card.create({
      name,
      link,
      owner,
      likes,
      createdAt,
    });
    res.send(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации' });
      return;
    }
    res.status(500).send({ message: `Ошибка сервера ${error}` });
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const deletedCard = await Card.findByIdAndDelete(cardId);
    if (!deletedCard) {
      res.status(404).send({ message: `Карточка c ID:${cardId} не найдена` });
      return;
    }

    res.send(deletedCard);
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
      return;
    }
    res.status(500).send({ message: `Ошибка сервера ${error}` });
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

    if (!likedCard) {
      res.status(404).send({ message: `Карточка c ID:${cardId} не найдена` });
      return;
    }

    res.send(likedCard);
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
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
    if (!likedCard) {
      res.status(404).send({ message: `Карточка c ID:${cardId} не найдена` });
      return;
    }

    res.send(likedCard);
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
      return;
    }
    res.status(500).send({ message: `Ошибка сервера ${error}` });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
