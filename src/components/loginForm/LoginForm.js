import React, { useState } from 'react';
import {loginUser} from "../../api/api";
import {useAuth} from "../../contexts/AuthContext";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await loginUser(email, password);
            login(token);
        } catch (error) {
            console.error("Erreur de connexion:", error);
            setError("Email or password is incorrect.");
        }
    };

    return (
        <div data-testid="login-form">
            <h2>Formulaire de Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div>
                    <label htmlFor="password">password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
