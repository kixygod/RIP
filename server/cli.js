const axios = require('axios');
const jwt = require('jsonwebtoken'); // Убедитесь, что установили библиотеку jsonwebtoken
const fs = require('fs');
const path = require('path');
const program = require('commander');

function saveToken(token) {
    fs.writeFileSync(path.join(__dirname, 'token.txt'), token, 'utf8');
}

function getSavedToken() {
    try {
        return fs.readFileSync(path.join(__dirname, 'token.txt'), 'utf8');
    } catch (error) {
        return null;
    }
}

function setAxiosAuthorizationToken() {
    const token = getSavedToken();
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
}

program
    .version('1.0.0')
    .description('Управление задачами на сервере');

program
    .command('login <username> <password>')
    .description('Аутентификация пользователя')
    .action(async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3001/login', { username, password });
            const token = response.data.token;
            saveToken(token);
            console.log('Login successful, token saved');
        } catch (error) {
            console.error('Login error:', error.message);
        }
    });

program
    .command('register <username> <password>')
    .description('Регистрация нового пользователя')
    .action(async (username, password) => {
        try {
            await axios.post('http://localhost:3001/register', { username, password });
            console.log('Registration successful');
        } catch (error) {
            console.error('Registration error:', error.message);
        }
    });

program
    .command('list')
    .description('Получить список заметок')
    .action(() => {
        const token = getSavedToken();
        if (!token) {
            console.error('Токен не найден. Пожалуйста, войдите в систему.');
            return;
        }

        const user_id = jwt.decode(token).id; // Декодирование токена для получения user_id
        setAxiosAuthorizationToken();

        axios.get('http://localhost:3001/api/items/get', { params: { user_id } })
            .then((response) => {
                if (Array.isArray(response.data)) {
                    console.log('Список заметок:');
                    response.data.forEach((item) => {
                        console.log(`ID: ${item.id}, Название: ${item.name}, Завершено: ${item.completed}`);
                    });
                } else {
                    console.error('Ожидалось, что элементы будут массивом:', response.data);
                }
            })
            .catch((error) => {
                console.error('Ошибка при получении заметок:', error);
            });
    });

program
    .command('add <todo>')
    .description('Добавить новую заметку')
    .action((todo) => {
        const token = getSavedToken();
        if (!token) {
            console.error('Токен не найден. Пожалуйста, войдите в систему.');
            return;
        }

        const user_id = jwt.decode(token).id; // Декодирование токена для получения user_id
        setAxiosAuthorizationToken();

        axios.post('http://localhost:3001/api/items/add', {
            user_id,
            name: todo,
            completed: false,
        })
            .then((response) => {
                console.log('Новая заметка добавлена:', response.data);
            })
            .catch((error) => {
                console.error('Ошибка при добавлении новой заметки:', error);
            });
    });

program
    .command('delete <id>')
    .description('Удалить заметку по ID')
    .action((id) => {
        const token = getSavedToken();
        if (!token) {
            console.error('Токен не найден. Пожалуйста, войдите в систему.');
            return;
        }

        const user_id = jwt.decode(token).id; // Декодирование токена для получения user_id
        setAxiosAuthorizationToken();

        axios.delete(`http://localhost:3001/api/items/del/${id}`, {
            data: { user_id }
        })
            .then(() => {
                console.log(`Заметка с ID ${id} удалена.`);
            })
            .catch((error) => {
                console.error('Ошибка при удалении заметки:', error);
            });
    });

program
    .command('toggle <id>')
    .description('Изменить состояние заметки на противоположное')
    .action((id) => {
        const token = getSavedToken();
        if (!token) {
            console.error('Токен не найден. Пожалуйста, войдите в систему.');
            return;
        }

        const user_id = jwt.decode(token).id;
        setAxiosAuthorizationToken();

        axios.get(`http://localhost:3001/api/items/get/${id}`, { params: { user_id } })
            .then(response => {
                const currentCompleted = response.data.completed;
                const newCompleted = !currentCompleted;
                return axios.put(`http://localhost:3001/api/items/complete/${id}`, {
                    completed: newCompleted,
                    user_id,
                })
                    .then(() => {
                        console.log(`Заметка ${id} обновлена.`);
                        const moveTo = newCompleted ? 'move-to-completed' : 'move-to-active';
                        return axios.put(`http://localhost:3001/api/items/${moveTo}/${id}`, { user_id });
                    })
                    .then(() => {
                        console.log(`Заметка перемещена в ${newCompleted ? 'завершенные' : 'активные'}.`);
                    });
            })
            .catch((error) => {
                console.error('Заметка перемещена в завершенные.');
            });
    });

program.parse(process.argv);
