const User = require('../models/user');

const {
  BAD_REQUEST_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_ERROR_CODE
} = require('../utils/errorCodes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((error) => {
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка при получении пользователей' }, error);
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: `Пользователь c ID:${userId} не найден` });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный идентификатор пользователя' }, error);
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка при получении пользователя' }, error);
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' }, error);
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка при создании пользователя' }, error);
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: `Пользователь c ID:${userId} не найден` });
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' }, error);
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка при обновлении профиля' }, error);
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: `Пользователь c ID:${userId} не найден` });
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' }, error);
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка при обновлении аватара' }), error;
      }
    });
};
