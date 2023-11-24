import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // API запрос для входа
            await axios.post('http://localhost:3001/login', { username, password });
            navigate('/main');
        } catch (error) {
            console.error('Ошибка при входе', error);
            alert('Ошибка входа!');
        }
    };

    const handleRegister = async () => {
        try {
            // API запрос для регистрации
            await axios.post('http://localhost:3001/register', { username, password });
            alert('Регистрация прошла успешно!');
            // Можете добавить автоматический вход после регистрации, если это необходимо
        } catch (error) {
            console.error('Ошибка при регистрации', error);
            alert('Ошибка регистрации!');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Войти</button>
            <button onClick={handleRegister}>Зарегистрироваться</button>
        </div>
    );
};

export default Auth;
