import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const TodoList = () => {
    const [todos, setTodos] = useState([]); // Список задач

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        axios
            .get('http://localhost:3001/api/items/get')
            .then((res) => setTodos(res.data.items))
            .catch((error) => {
                console.error('Error fetching todos:', error);
            });
    };

    const deleteTodo = (id) => {
        axios
            .delete(`http://localhost:3001/api/items/del/${id}`)
            .then(() => {
                // Обновляем список задач, удаляя задачу с указанным id
                setTodos(todos => todos.filter(todo => todo.id !== id));
            })
            .catch((error) => {
                console.error('Error deleting task:', error);
            });
    };

    if (todos.length === 0) return <div>No todos available.</div>;

    return (
        <div>
            {todos.map((todo) => (
                <div key={todo.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 0px 10px 10px' }}>
                    <FontAwesomeIcon
                        icon={faTrash}
                        style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '4px' }}
                        onClick={() => deleteTodo(todo.id)} // Вызываем функцию deleteTodo при клике на иконку
                    />
                    <span style={{ marginLeft: '20px' }}>{todo.name}</span>
                </div>
            ))}
        </div>
    );
};

export default TodoList;
