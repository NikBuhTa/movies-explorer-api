require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const { NODE_ENV, DB_URL } = process.env;
const { PORT = 3000 } = process.env;
const routes = require('./routes/index');
const { createUser, login, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const handleErrors = require('./middlewares/error-handler');
const { registrationValidator, loginValidator } = require('./middlewares/user-validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(cors({
  origin: 'https://moviesexplorer.nomoredomainsicu.ru',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(limiter);

app.post('/signin', loginValidator, login);
app.post('/signup', registrationValidator, createUser);

app.use(auth);
app.post('/signout', logout);
app.use(routes);
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  handleErrors(err, req, res, next);
});

app.listen(PORT, () => {
  console.log('Connected', PORT);
});
