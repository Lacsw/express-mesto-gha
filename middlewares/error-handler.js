/* eslint-disable consistent-return */
const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('http2').constants;

module.exports = (err, req, res, next) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    message:
      statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR
        ? `Ошибка сервера ${err}`
        : message,
    statusCode,
  });
};
