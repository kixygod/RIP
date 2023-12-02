import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const { data } = await axios.post('http://localhost:3001/login', { username, password });
            if (!data.token) {
                throw new Error('Token not received from server');
            }
            localStorage.setItem('token', data.token); // Сохраняем токен в localStorage
            console.log('Token received:', data.token); // Добавляем логирование токена в консоль для проверки
            navigate('/main');
        } catch (error) {
            console.error('Error during login:', error.message);
            // Добавим визуальное предупреждение пользователю
            alert('Ошибка входа: ' + error.message);
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
        <div className='auth-div' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <input
                type="text"
                placeholder="Login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className='auth-login' onClick={handleLogin}>Войти</button>
            <button className='auth-reg' onClick={handleRegister}>Зарегистрироваться</button>
        </div>
    );
};

export default Auth;
