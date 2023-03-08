const http2 = require('http2');
const mongoose = require('mongoose');

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
  const { name, link } = req.body;

  try {
    const newCard = await Card.create({
      name,
      link,
    });
    res.status(HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка валидации' });
      return;
    }
    res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: `Ошибка сервера ${error}` });
  }
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.isValidObjectId(cardId)) {
    res
      .status(HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'Невалидный карточки ID' });
  }

  Card.findByIdAndDelete(cardId)
    .orFail(() => {
      res
        .status(HTTP_STATUS_NOT_FOUND)
        .send({ message: `Карточка c ID:${cardId} не найдена` });
    })
    .then((deletedCard) => {
      res.status(HTTP_STATUS_OK).send(deletedCard);
    })
    .catch((error) => {
      if (res.headersSent) {
        return;
      }
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера ${error}` });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(cardId) || !mongoose.isValidObjectId(userId)) {
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Невалидный ID' });
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      res
        .status(HTTP_STATUS_NOT_FOUND)
        .send({ message: `Карточка c ID:${cardId} не найдена` });
    })
    .then((likedCard) => {
      res.status(HTTP_STATUS_OK).send(likedCard);
    })
    .catch((error) => {
      if (res.headersSent) {
        return;
      }
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера ${error}` });
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(cardId) || !mongoose.isValidObjectId(userId)) {
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Невалидный ID' });
  }

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      res
        .status(HTTP_STATUS_NOT_FOUND)
        .send({ message: `Карточка c ID:${cardId} не найдена` });
    })
    .then((likedCard) => {
      res.status(HTTP_STATUS_OK).send(likedCard);
    })
    .catch((error) => {
      if (res.headersSent) {
        return;
      }
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
