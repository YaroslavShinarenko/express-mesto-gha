const Card = require('../models/card');

const {
  BAD_REQUEST_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_ERROR_CODE
} = require('../utils/errorCodes');


module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((error) => {
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка при получении карточек'});
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка при создании карточки'});
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: `Карточки с id:${cardId} не существует.` });
      }
      res.send({ data: card });
    })
    .catch((error) => {
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка при удалении карточки'});
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: `Карточки с id:${cardId} не существует.` });
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка при постановке лайка'});
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: `Карточки с id:${cardId} не существует.` });
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка при снятии лайка'});
      }
    });
};
