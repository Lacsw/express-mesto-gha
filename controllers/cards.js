const http2 = require('http2');
const Card = require('../models/card');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(HTTP_STATUS_OK).send(cards);
  } catch (error) {
    res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: `Ошибка сервера ${error}` });
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
    res.status(HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка валидации' });
      return;
    }
    res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: `Ошибка сервера ${error}` });
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const deletedCard = await Card.findByIdAndDelete(cardId);
    if (!deletedCard) {
      res
        .status(HTTP_STATUS_NOT_FOUND)
        .send({ message: `Карточка c ID:${cardId} не найдена` });
      return;
    }

    res.status(HTTP_STATUS_OK).send(deletedCard);
  } catch (error) {
    if (error.name === 'CastError') {
      res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные.' });
      return;
    }
    res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: `Ошибка сервера ${error}` });
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
      res
        .status(HTTP_STATUS_NOT_FOUND)
        .send({ message: `Карточка c ID:${cardId} не найдена` });
      return;
    }

    res.status(HTTP_STATUS_OK).send(likedCard);
  } catch (error) {
    if (error.name === 'CastError') {
      res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные.' });
      return;
    }
    res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: `Ошибка сервера ${error}` });
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
      res
        .status(HTTP_STATUS_NOT_FOUND)
        .send({ message: `Карточка c ID:${cardId} не найдена` });
      return;
    }

    res.status(HTTP_STATUS_OK).send(likedCard);
  } catch (error) {
    if (error.name === 'CastError') {
      res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные.' });
      return;
    }
    res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: `Ошибка сервера ${error}` });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
