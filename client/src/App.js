import "./style.css"
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Chat from './components/Chat';

const TodoList = ({ activeTodos, completedTodos, onDelete, onToggleComplete }) => {
    return (
        <div>
            <h2>Активные задачи</h2>
            <div className="todo-list">
                {activeTodos.map((todo) => (
                    <div key={todo.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 0px 10px 10px' }}>
                        <FontAwesomeIcon
                            icon={faTrash}
                            style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '4px' }}
                            onClick={() => onDelete(todo.id)}
                        />
                        <input
                            type="checkbox"
                            style={{ transform: 'scale(1.5)', marginLeft: '20px' }}
                            checked={todo.completed}
                            onChange={() => onToggleComplete(todo.id, !todo.completed)}
                        />
                        <span style={{ marginLeft: '20px', textDecoration: todo.completed ? 'line-through' : 'none' }}>
                            {todo.name}
                        </span>
                    </div>
                ))}
            </div>


            <h2>Завершенные задачи</h2>
            <div className="todo-list">
                {completedTodos.map((todo) => (
                    <div key={todo.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 0px 10px 10px' }}>
                        <FontAwesomeIcon
                            icon={faTrash}
                            style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '4px' }}
                            onClick={() => onDelete(todo.id)}
                        />
                        <input
                            type="checkbox"
                            style={{ transform: 'scale(1.5)', marginLeft: '20px' }}
                            checked={todo.completed}
                            onChange={() => onToggleComplete(todo.id, !todo.completed)}
                        />
                        <span style={{ marginLeft: '20px', textDecoration: todo.completed ? 'line-through' : 'none' }}>
                            {todo.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AddTodo = ({ onAddTodo }) => {
    const [newTodo, setNewTodo] = useState('');

    const handleAddTodo = () => {
        axios
            .post('http://localhost:3001/api/items/add', {
                name: newTodo,
                completed: false,
            })
            .then((response) => {
                const data = response.data;
                console.log('New todo added:', data);
                setNewTodo('');
                onAddTodo(data);
            })
            .catch((error) => {
                console.error('Error adding new todo:', error);
            });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', marginBottom: '5px' }}>
            <input className="input-add"
                type="text"
                placeholder="Введите новую заметку"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress} // Добавляем обработчик события нажатия клавиши
                style={{ marginRight: '20px', marginLeft: '10px', fontSize: '1.5rem' }}
            />
            <button onClick={handleAddTodo} style={{ height: '3.5rem', width: '3.5rem' }}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    );
};

const App = () => {
    const [todos, setTodos] = useState([]);

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

    const addTodo = (newTodo) => {
        setTodos([...todos, newTodo]);
        fetchTodos();
    };

    const deleteTodo = (id) => {
        axios
            .delete(`http://localhost:3001/api/items/del/${id}`)
            .then(() => {
                setTodos(todos.filter((todo) => todo.id !== id));
            })
            .catch((error) => {
                console.error('Error deleting task:', error);
            });
    };

    const toggleCompleteTodo = (id, completed) => {
        const updatedTodos = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, completed };
            }
            return todo;
        });

        setTodos(updatedTodos);

        axios
            .put(`http://localhost:3001/api/items/complete/${id}`, { completed })
            .then(() => {
                console.log(`Todo ${id} updated`);
                if (completed) {
                    axios
                        .put(`http://localhost:3001/api/items/move-to-completed/${id}`)
                        .then(() => {
                            console.log(`Todo ${id} moved to completed`);
                        })
                        .catch((error) => {
                            console.error('Error moving todo to completed:', error);
                        });
                } else {
                    axios
                        .put(`http://localhost:3001/api/items/move-to-active/${id}`)
                        .then(() => {
                            console.log(`Todo ${id} moved to active`);
                        })
                        .catch((error) => {
                            console.error('Error moving todo to active:', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Error updating todo:', error);
            });
    };

    const activeTodos = todos.filter((todo) => !todo.completed);
    const completedTodos = todos.filter((todo) => todo.completed);

    return (
        <Router>
            <div className="main-column">
                <div className="main-row">
                    <div className="main-app">
                        <h1>Список задач</h1>
                        <AddTodo onAddTodo={addTodo} />
                        <TodoList
                            activeTodos={activeTodos}
                            completedTodos={completedTodos}
                            onDelete={deleteTodo}
                            onToggleComplete={toggleCompleteTodo}
                        />
                    </div>
                    <div className="chat">
                        <Chat></Chat>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;