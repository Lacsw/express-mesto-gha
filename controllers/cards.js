const http2 = require('http2');
const mongoose = require('mongoose');

const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = http2.constants;

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.status(HTTP_STATUS_OK).send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const newCard = await Card.create({ name, link, owner });

    res.status(HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Ошибка валидации'));
    } else {
      next(error);
    }
  }
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(cardId)) {
    throw BadRequestError('Невалидный ID');
  }

  Card.findById(cardId)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка c ID:${cardId} не найдена`);
      }
      if (card.owner._id.toString() !== userId) {
        throw new ForbiddenError('Можно удалять только свои карточки');
      } else {
        Card.findByIdAndDelete(cardId)
          .then((deletedCard) => {
            res.status(HTTP_STATUS_OK).send(deletedCard);
          })
          .catch(next);
      }
    })
    .catch(next);
};

const toogleLikeCard = (req, res, next, data) => {
  const { cardId } = req.params;

  if (!mongoose.isValidObjectId(cardId)) {
    throw new BadRequestError('Невалидный ID');
  }
  Card.findByIdAndUpdate(cardId, data, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      next(new NotFoundError(`Карточка c ID:${cardId} не найдена`));
    })
    .then((likedCard) => {
      res.status(HTTP_STATUS_OK).send(likedCard);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const userId = req.user._id;
  const data = { $addToSet: { likes: userId } };

  toogleLikeCard(req, res, next, data);
};

const dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  const data = { $pull: { likes: userId } };

  toogleLikeCard(req, res, next, data);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
