const router = require('express').Router();
const { errors } = require('celebrate');

const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;

const authRouter = require('./auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/error-handler');

router.use('/', authRouter);
router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.all('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

router.use(errors());
router.use(errorHandler);

module.exports = router;
