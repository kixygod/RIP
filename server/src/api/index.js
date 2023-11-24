const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const app = express();


const items = require('./items');

router.use(bodyParser.json());

router.get('/', (req, res) => {
    res.json({
        message: "Добро пожаловать в API"
    });
});

router.use('/items', items);
module.exports = router;
