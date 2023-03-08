const router = require('express').Router();
const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.all('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = router;
