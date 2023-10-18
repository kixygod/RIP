import React, { useState } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddTodo = ({ onAddTodo }) => {
    const [newTodo, setNewTodo] = useState('');

    const handleAddTodo = () => {
        axios
            .post('http://localhost:3001/api/items/add', {
                name: newTodo,
                completed: false, // Можно указать начальное значение
            })
            .then(response => {
                const data = response.data;
                console.log('New todo added:', data);
                setNewTodo(''); // Очистить поле ввода после добавления заметки
                onAddTodo(data); // Вызвать функцию-колбэк для обновления списка заметок
            })
            .catch(error => {
                console.error('Error adding new todo:', error);
            });
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <input
                type="text"
                placeholder="Введите новую заметку"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                style={{ marginRight: '20px', marginLeft: '10px', fontSize: '1.5rem' }} // Применить отступ справа
            />
            <button onClick={handleAddTodo} style={{ height: '2rem', width: '2rem' }}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    );
};

export default AddTodo;
