#!/usr/bin/env node
const program = require('commander');
const axios = require('axios');

program
    .version('1.0.0')
    .description('Управление задачами на сервере');

// Подкоманда для получения списка задач
program
    .command('list')
    .description('Получить список задач')
    .action(() => {
        axios.get('http://localhost:3001/api/items/get')
            .then((response) => {
                console.log('Список задач:');
                response.data.items.forEach((item) => {
                    console.log(`ID: ${item.id}, Название: ${item.name}, Завершено: ${item.completed}`);
                });
            })
            .catch((error) => {
                console.error('Ошибка при получении списка задач:', error);
            });
    });

// Подкоманда для создания новой задачи
program
    .command('create <name>')
    .description('Создать новую задачу')
    .action((name) => {
        axios.post('http://localhost:3001/api/items/add', {
            name,
            completed: false,
        })
            .then((response) => {
                console.log('Новая задача создана:');
                console.log(`ID: ${response.data.id}, Название: ${response.data.name}, Завершено: ${response.data.completed}`);
            })
            .catch((error) => {
                console.error('Ошибка при создании задачи:', error);
            });
    });

// Подкоманда для удаления задачи по ID
program
    .command('delete <id>')
    .description('Удалить задачу по ID')
    .action((id) => {
        axios.delete(`http://localhost:3001/api/items/del/${id}`)
            .then(() => {
                console.log(`Задача с ID ${id} удалена`);
            })
            .catch((error) => {
                console.error('Ошибка при удалении задачи:', error);
            });
    });

// Подкоманда для изменения состояния задачи по ID
program
    .command('toggle <id>')
    .description('Изменить состояние задачи (выполнено/не выполнено) по ID')
    .action((id) => {
        axios.get(`http://localhost:3001/api/items/get/${id}`)
            .then((response) => {
                const currentStatus = response.data.completed;
                const newStatus = !currentStatus;

                const route = newStatus ? 'move-to-completed' : 'move-to-active'; // Выбираем маршрут в зависимости от состояния

                axios.put(`http://localhost:3001/api/items/complete/${id}`, { completed: newStatus })
                    .then(() => {
                        console.log(`Задача с ID ${id} изменена на состояние: ${newStatus ? 'выполнено' : 'не выполнено'}`);

                        // Используем выбранный маршрут для переноса задачи
                        axios.put(`http://localhost:3001/api/items/${route}/${id}`)
                            .then(() => {
                                console.log(`Задача с ID ${id} перемещена: ${newStatus ? 'в активные' : 'в завершенные'}`);
                            })
                            .catch((error) => {
                                console.error('Ошибка при перемещении задачи:', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Ошибка при изменении состояния задачи:', error);
                    });
            })
            .catch((error) => {
                console.error('Ошибка при получении задачи по ID:', error);
            });
    });


program.parse(process.argv);
