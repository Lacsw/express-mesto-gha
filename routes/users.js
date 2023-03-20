const router = require('express').Router();

const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);
router.get('/:userId', getUser);

module.exports = router;
