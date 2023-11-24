const express = require('express');
const api = require('./api');
const cors = require('cors');

const app = express();
const PORT = 3001;


app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "Hello world"
    });
});

app.use('/api', api);

app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`);
});
