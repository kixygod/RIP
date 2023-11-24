const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Инициализация БД и создание таблицы, если она еще не создана
const db = new sqlite3.Database('./todo.db', (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT,
            completed BOOLEAN
        )`, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log("Table 'tasks' created or already exists.");
            }
        });
    }
});

// Получение всех заметок пользователя
router.get('/get', (req, res) => {
    const userId = req.query.user_id;
    const query = "SELECT * FROM tasks WHERE user_id = ?";
    db.all(query, userId, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        const serializedTasks = rows.map((task) => ({
            id: task.id,
            user_id: task.user_id,
            name: task.name,
            completed: task.completed === 1 // SQLite не поддерживает BOOLEAN, используется INTEGER
        }));
        res.json(serializedTasks);
    });
});

// Получение конкретной заметки пользователя
router.get('/get/:id', (req, res) => {
    const taskId = req.params.id;
    const userId = req.query.user_id; // Предполагается, что user_id передается в запросе
    const query = "SELECT * FROM tasks WHERE id = ? AND user_id = ?";
    db.get(query, [taskId, userId], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            const serializedTask = {
                id: row.id,
                user_id: row.user_id,
                name: row.name,
                completed: row.completed === 1
            };
            res.json(serializedTask);
        } else {
            res.status(404).json({ error: "Task not found" });
        }
    });
});

// Добавление заметки
router.post('/add', (req, res) => {
    const { user_id, name, completed } = req.body;
    const completedValue = completed ? 1 : 0;
    const query = "INSERT INTO tasks (user_id, name, completed) VALUES (?, ?, ?)";
    db.run(query, [user_id, name, completedValue], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Удаление заметки
router.delete('/del/:id', (req, res) => {
    const { user_id, name, completed } = req.body;
    console.log('server req.params.id ', req.params.id);
    const taskId = req.params.id;
    const userId = req.body.user_id;
    const query = "DELETE FROM tasks WHERE id = ? AND user_id = ?";
    db.run(query, [taskId, user_id], function (err) {
        if (err) {
            console.log('server user_id ', userId);
            console.error(err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "Task not found or user mismatch" });
        } else {
            res.status(200).json({ message: "Task deleted successfully" });
        }
    });
});

// Обновление статуса заметки на "выполнено"
router.put('/complete/:id', (req, res) => {
    const { user_id, name, completed } = req.body;
    console.log('server req.params.id ', req.params.id);
    const taskId = req.params.id;
    const userId = req.body.user_id;
    const query = "UPDATE tasks SET completed = 1 WHERE id = ? AND user_id = ?";
    db.run(query, [taskId, user_id], function (err) {
        if (err) {
            console.log('server user_id ', userId);
            console.error(err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            console.log('taskId ', taskId);
            console.log('server user_id ', userId);
            res.status(404).json({ error: "Task not found or user mismatch" });
        } else {
            res.status(200).json({ message: "Task marked as completed successfully" });
            console.log('taskId ', taskId);
            console.log('server user_id ', userId);
        }
    });
});

// Обновление статуса заметки на "не выполнено"
router.put('/move-to-active/:id', (req, res) => {
    const taskId = req.params.id;
    const userId = req.body.user_id;
    const query = "UPDATE tasks SET completed = 0 WHERE id = ? AND user_id = ?";
    db.run(query, [taskId, userId], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "Task not found or user mismatch" });
        } else {
            res.status(200).json({ message: "Task moved to active successfully" });
        }
    });
});

module.exports = router;
