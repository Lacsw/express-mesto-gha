const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { URI_REGEX, OBJECTID_REGEX } = require('../utils/constants');

router.get('/', getCards);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(URI_REGEX),
    }),
  }),
  createCard
);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().regex(OBJECTID_REGEX),
    }),
  }),
  deleteCard
);
router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().regex(OBJECTID_REGEX),
    }),
  }),
  likeCard
);
router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().regex(OBJECTID_REGEX),
    }),
  }),
  dislikeCard
);

module.exports = router;
