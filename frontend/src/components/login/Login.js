import React, { useState } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:8001/api/users/login',
                {
                    email,
                    password,
                },
            );

            localStorage.setItem('userToken', response.data.token);
            navigate('/'); // Redirect to the main page after successful login
        } catch (error) {
            console.error('Error during login:', error);
            setError('Wrong email or password'); // Set an error message
        }
    };

    return (
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={handleLogin}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign In</h3>
                    <div className="form-group mt-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control mt-1"
                            placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div id="block_container">
                        <div
                            className="d-flex justify-content-between mt-3"
                            id="bloc1">
                            <div id="block1">
                                <p>
                                    New User? <a href="/register">Register</a>
                                </p>
                            </div>

                            <div className="d-grid gap-2" id="block2">
                                <button
                                    type="submit"
                                    className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-danger">{error}</p>}
                </div>
            </form>
        </div>
    );
};

export default Login;
