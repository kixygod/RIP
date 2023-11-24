const api = require('./api');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
const PORT = 3001;
const SECRET_KEY = "todo"; // В реальном приложении используйте переменную окружения

app.use(cors());
app.use(express.json());

// Открываем соединение с базой данных
const dbPromise = open({
    filename: './users.db',
    driver: sqlite3.Database
});

// Функция для инициализации базы данных
async function initializeDb() {
    const db = await dbPromise;
    await db.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
}

// Инициализируем базу данных при старте сервера
initializeDb().catch(console.error);

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }
        const db = await dbPromise;
        const user = await db.get('SELECT * FROM users WHERE username = ?', username);
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, username }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ token }); // Отправляем токен клиенту
        } else {
            res.status(401).send('Incorrect username or password');
        }
    } catch (error) {
        res.status(500).send('Error logging in user');
    }
});

// Маршрут для регистрации
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }

        const db = await dbPromise;
        const existingUser = await db.get('SELECT * FROM users WHERE username = ?', username);

        if (existingUser) {
            return res.status(409).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, hashedPassword);

        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

app.use('/api', api);

app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`);
});
