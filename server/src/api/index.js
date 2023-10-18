const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const app = express();


// Импортируйте модуль items (если он существует)
const items = require('./items');

// Примените парсинг JSON-запросов
router.use(bodyParser.json());

// Маршрут приветствия
router.get('/', (req, res) => {
    res.json({
        message: "Добро пожаловать в API"
    });
});

// Подключите маршруты для работы с задачами из модуля items
router.use('/items', items);
module.exports = router;
