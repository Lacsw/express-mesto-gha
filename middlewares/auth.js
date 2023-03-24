const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-err');

const { SECRET_WORD } = require('../config');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  try {
    const payload = jwt.verify(token, SECRET_WORD);
    req.user = payload;
  } catch (error) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  next();
};
