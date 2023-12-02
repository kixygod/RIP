import "./style.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Chat from "./components/Chat";
import Auth from "./components/Auth";

const TodoList = ({
    activeTodos,
    completedTodos,
    onDelete,
    onToggleComplete,
}) => {
    return (
        <div className="inner-todo-row">
            <div className="inner-column">
                <h2>Активные задачи</h2>
                <div className="todo-list">
                    {activeTodos.map((todo) => (
                        <div
                            key={todo.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "10px 0px 10px 10px",
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faTrash}
                                style={{ cursor: "pointer", border: "none", padding: "4px" }}
                                onClick={() => onDelete(todo.id)}
                            />
                            <input
                                type="checkbox"
                                style={{ transform: "scale(1.5)", marginLeft: "20px" }}
                                checked={todo.completed}
                                onChange={() => onToggleComplete(todo.id, !todo.completed)}
                            />
                            <span
                                style={{
                                    marginLeft: "20px",
                                    textDecoration: todo.completed ? "line-through" : "none",
                                }}
                            >
                                {todo.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="inner-column">
                <h2>Завершенные задачи</h2>
                <div className="todo-list">
                    {completedTodos.map((todo) => (
                        <div
                            key={todo.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "10px 0px 10px 10px",
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faTrash}
                                style={{ cursor: "pointer", border: "none", padding: "4px" }}
                                onClick={() => onDelete(todo.id)}
                            />
                            <input
                                type="checkbox"
                                style={{ transform: "scale(1.5)", marginLeft: "20px" }}
                                checked={todo.completed}
                                onChange={() => onToggleComplete(todo.id, !todo.completed)}
                            />
                            <span
                                style={{
                                    marginLeft: "20px",
                                    textDecoration: todo.completed ? "line-through" : "none",
                                }}
                            >
                                {todo.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AddTodo = ({ onAddTodo }) => {
    const [newTodo, setNewTodo] = useState("");

    const getSavedToken = () => {
        return localStorage.getItem("token");
    };

    // Добавление заголовка авторизации с токеном к запросам axios
    axios.defaults.headers.common["Authorization"] = `Bearer ${getSavedToken()}`;

    const handleAddTodo = () => {
        const token = getSavedToken();
        const user_id = jwtDecode(token).id;
        console.log("user_id ", user_id); // Функция для извлечения user_id из токена
        console.log("token ", token); // Функция для извлечения user_id из токена
        axios
            .post("http://localhost:3001/api/items/add", {
                user_id, // Добавление user_id в запрос
                name: newTodo,
                completed: false,
            })
            .then((response) => {
                const data = response.data;
                console.log("New todo added:", response);
                setNewTodo("");
                onAddTodo(data);
            })
            .catch((error) => {
                console.error("Error adding new todo:", error);
            });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleAddTodo();
        }
    };

    return (
        <div className="enter-task">
            <input
                className="input-add"
                type="text"
                placeholder="Введите задачу"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ marginRight: "20px", marginLeft: "10px", fontSize: "1.5rem" }}
            />
            <button className="butt-add" onClick={handleAddTodo}>
                Добавить
            </button>
        </div>
    );
};

const App = () => {
    const [todos, setTodos] = useState([]);

    const getSavedToken = () => {
        return localStorage.getItem("token");
    };

    // Добавление заголовка авторизации с токеном к запросам axios
    axios.defaults.headers.common["Authorization"] = `Bearer ${getSavedToken()}`;

    const fetchTodos = () => {
        const token = getSavedToken();
        const user_id = jwtDecode(token).id;

        // Устанавливаем заголовок авторизации для каждого запроса
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        axios
            .get("http://localhost:3001/api/items/get", {
                params: {
                    user_id, // передаем user_id как параметр запроса
                },
            })
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setTodos(res.data);
                } else {
                    console.error("Expected items to be an array:", res.data);
                    setTodos([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching todos:", error);
                // Обработка ошибки
            });
    };
    try {
        const token = getSavedToken();
        const user_id = jwtDecode(token).id;
        if (user_id !== undefined) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                fetchTodos();
            });
        }
    } catch (error) { }

    const addTodo = (newTodo) => {
        setTodos([...todos, newTodo]);
        fetchTodos();
    };

    const deleteTodo = (id) => {
        const token = getSavedToken();
        console.log("fetchTodos token ", token);
        const user_id = jwtDecode(token).id;
        console.log("fetchTodos user_id ", user_id);
        axios
            .delete(`http://localhost:3001/api/items/del/${id}`, {
                data: { user_id: user_id },
            })
            .then(() => {
                setTodos(todos.filter((todo) => todo.id !== id));
            })
            .catch((error) => {
                console.error("Error deleting task:", error);
            });
    };

    const toggleCompleteTodo = (id, completed) => {
        const token = getSavedToken();
        console.log("fetchTodos token ", token);
        const user_id = jwtDecode(token).id;
        console.log("fetchTodos user_id ", user_id);
        const updatedTodos = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, completed };
            }
            return todo;
        });

        setTodos(updatedTodos);

        axios
            .put(`http://localhost:3001/api/items/complete/${id}`, {
                completed,
                user_id,
            })
            .then(() => {
                console.log(`Todo ${id} updated`);
                if (completed) {
                    axios
                        .put(`http://localhost:3001/api/items/move-to-completed/${id}`, {
                            user_id,
                        })
                        .then(() => {
                            console.log(`Todo ${id} moved to completed`);
                        })
                        .catch((error) => {
                            console.error("Error moving todo to completed:", error);
                        });
                } else {
                    axios
                        .put(`http://localhost:3001/api/items/move-to-active/${id}`, {
                            user_id,
                        })
                        .then(() => {
                            console.log(`Todo ${id} moved to active`);
                        })
                        .catch((error) => {
                            console.error("Error moving todo to active:", error);
                        });
                }
            })
            .catch((error) => {
                console.error("Error updating todo:", error);
            });
    };

    const activeTodos = todos.filter((todo) => !todo.completed);
    const completedTodos = todos.filter((todo) => todo.completed);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Auth></Auth>}></Route>
                <Route
                    path="/main"
                    element={
                        <div className="main-column">
                            <div className="main-row">
                                <div className="main-app">
                                    <h1>Самый крутой ТуДушник</h1>
                                    <AddTodo onAddTodo={addTodo} />
                                    <TodoList
                                        activeTodos={activeTodos}
                                        completedTodos={completedTodos}
                                        onDelete={deleteTodo}
                                        onToggleComplete={toggleCompleteTodo}
                                    />
                                </div>
                            </div>
                            <div className="chat-row">
                                <div className="chat">
                                    <Chat></Chat>
                                </div>
                            </div>
                        </div>
                    }
                ></Route>
            </Routes>
        </Router>
    );
};

export default App;
