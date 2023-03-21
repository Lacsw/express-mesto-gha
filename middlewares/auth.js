/* eslint consistent-return: off */
const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-err');

const { SECRET_WORD } = require('../config');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, SECRET_WORD);
  } catch (error) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
