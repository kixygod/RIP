const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('todo.db');

// Создайте таблицу для хранения задач, если ее еще нет
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, completed BOOLEAN)");
});

// Маршрут для получения списка задач
router.get('/get', (req, res) => {
    const query = "SELECT * FROM tasks";
    db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch tasks" });
        } else {
            // Сериализируйте каждую задачу перед отправкой клиенту
            const serializedTasks = rows.map(task => ({
                id: task.id,
                name: task.name,
                completed: task.completed === 1 // Преобразовать 0/1 в true/false
            }));
            res.json({ items: serializedTasks });
        }
    });
});

router.get('/get/:id', (req, res) => {
    const taskId = req.params.id; // Получение ID задачи из параметра маршрута

    const query = "SELECT * FROM tasks WHERE id = ?";
    db.get(query, [taskId], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch the task" });
        } else {
            if (row) {
                // Сериализуйте задачу перед отправкой клиенту
                const serializedTask = {
                    id: row.id,
                    name: row.name,
                    completed: row.completed === 1 // Преобразовать 0/1 в true/false
                };
                res.json(serializedTask);
            } else {
                res.status(404).json({ error: "Task not found" });
            }
        }
    });
});

// Маршрут для создания новой задачи
router.post('/add', (req, res) => {
    const { name, completed } = req.body; // Предполагается, что данные поступают в формате JSON

    // Десериализуйте данные перед выполнением запроса к базе данных
    const completedValue = completed ? 1 : 0;

    const query = "INSERT INTO tasks (name, completed) VALUES (?, ?)";
    db.run(query, [name, completedValue], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to create task" });
        } else {
            res.json({ id: this.lastID, name, completed });
        }
    });
});

// Маршрут для удаления задачи
router.delete('/del/:id', (req, res) => {
    const taskId = req.params.id;

    const query = "DELETE FROM tasks WHERE id = ?";
    db.run(query, [taskId], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to delete task" });
        } else {
            if (this.changes === 0) {
                res.status(404).json({ error: "Task not found" });
            } else {
                res.json({ message: "Task deleted successfully" });
            }
        }
    });
});

// Маршрут для обновления статуса заметки
router.put('/complete/:id', (req, res) => {
    const taskId = req.params.id;

    const query = "UPDATE tasks SET completed = true WHERE id = ?";
    db.run(query, [taskId], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to update task" });
        } else {
            if (this.changes === 0) {
                res.status(404).json({ error: "Task not found" });
            } else {
                res.json({ message: "Task updated successfully" });
            }
        }
    });
});

// Маршрут для обновления статуса заметки
router.put('/move-to-active/:id', (req, res) => {
    const taskId = req.params.id;

    const query = "UPDATE tasks SET completed = false WHERE id = ?";
    db.run(query, [taskId], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to update task" });
        } else {
            if (this.changes === 0) {
                res.status(404).json({ error: "Task not found" });
            } else {
                res.json({ message: "Task updated successfully" });
            }
        }
    });
});

// Маршрут для обновления статуса заметки
router.put('/move-to-completed/:id', (req, res) => {
    const taskId = req.params.id;

    const query = "UPDATE tasks SET completed = true WHERE id = ?";
    db.run(query, [taskId], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to update task" });
        } else {
            if (this.changes === 0) {
                res.status(404).json({ error: "Task not found" });
            } else {
                res.json({ message: "Task updated successfully" });
            }
        }
    });
});


module.exports = router;
