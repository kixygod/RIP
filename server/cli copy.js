#!/usr/bin/env node
const program = require('commander');
const axios = require('axios');

program
    .version('1.0.0')
    .description('Управление задачами на сервере');

program
    .command('help')
    .description('Получить список команд')
    .action(() => {
        console.log("list - посмотреть все задачи");
        console.log("create <name> - создать новую задачу");
        console.log("delete <id> - удалить задачу по id");
        console.log("toggle <id> - изменить состояние задачи");
    });


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

program
    .command('toggle <id>')
    .description('Изменить состояние задачи (выполнено/не выполнено) по ID')
    .action((id) => {
        axios.get(`http://localhost:3001/api/items/get/${id}`)
            .then((response) => {
                const currentStatus = response.data.completed;
                const newStatus = !currentStatus;

                const route = newStatus ? 'move-to-completed' : 'move-to-active';

                axios.put(`http://localhost:3001/api/items/complete/${id}`, { completed: newStatus })
                    .then(() => {
                        console.log(`Задача с ID ${id} изменена на состояние: ${newStatus ? 'выполнено' : 'не выполнено'}`);

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
