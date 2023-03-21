const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

const uriRegEx = /^(http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserInfo
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(uriRegEx),
    }),
  }),
  updateUserAvatar
);
router.get('/:userId', getUser);

module.exports = router;
