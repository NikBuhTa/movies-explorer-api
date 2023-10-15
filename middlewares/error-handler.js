const handleErrors = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMessage = statusCode === 500 ? 'Ошибка на сервере' : err.message;
  res.status(statusCode).send({ message: errorMessage });
  next();
};

module.exports = handleErrors;
