const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// IPv4 works for windows
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true });

// IPv6 works for linux/mac
// mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.use((req, res, next) => {
  req.user = {
    _id: '649272b56d9cbc220613e5fc', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', require('./src/routes/users'));
app.use('/', require('./src/routes/cards'));

app.use((req, res) => {
  res.status(404).json({ message: 'Некорректный путь запроса' });
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT);
