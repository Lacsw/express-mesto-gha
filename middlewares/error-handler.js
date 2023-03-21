const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('http2').constants;

module.exports = (err, req, res) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR
        ? `Ошибка сервера ${err}`
        : message,
  });
};
