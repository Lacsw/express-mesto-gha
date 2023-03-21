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
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.status(HTTP_STATUS_OK).send(cards);
  } catch (error) {
    res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: `Ошибка сервера ${error}` });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const data = await Card.create({ name, link, owner });
    const newCard = await data.populate(['owner', 'likes']);

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
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(cardId)) {
    res
      .status(HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'Невалидный ID карточки' });
    return;
  }

  Card.findById(cardId)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: `Карточка c ID:${cardId} не найдена` });
        return;
      }
      if (card.owner._id.toString() !== userId) {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Можно удалять только свои карточки' });
      } else {
        Card.findByIdAndDelete(cardId)
          .then((deletedCard) => {
            res.status(HTTP_STATUS_OK).send(deletedCard);
          })
          .catch((error) => {
            res
              .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
              .send({ message: `Ошибка сервера ${error}` });
          });
      }
    })
    .catch((error) => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера ${error}` });
    });
};

const toogleLikeCard = (req, res, data) => {
  const { cardId } = req.params;

  if (!mongoose.isValidObjectId(cardId)) {
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Невалидный ID' });
    return;
  }

  Card.findByIdAndUpdate(cardId, data, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      res
        .status(HTTP_STATUS_NOT_FOUND)
        .send({ message: `Карточка c ID:${cardId} не найдена` });
    })
    .then((likedCard) => {
      res.status(HTTP_STATUS_OK).send(likedCard);
    })
    .catch((error) => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера ${error}` });
    });
};

const likeCard = (req, res) => {
  const userId = req.user._id;
  const data = { $addToSet: { likes: userId } };

  toogleLikeCard(req, res, data);
};

const dislikeCard = (req, res) => {
  const userId = req.user._id;
  const data = { $pull: { likes: userId } };

  toogleLikeCard(req, res, data);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
