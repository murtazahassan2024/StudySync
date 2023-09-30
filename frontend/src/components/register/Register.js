import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        securityQuestion: 'What is your favourite book?',
        securityAnswer: '',
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:8001/api/users/',
                formData,
            );
            localStorage.setItem('userToken', response.data.token);
            navigate('/login'); // Redirect to main page after successful registration
        } catch (error) {
            console.error('Error during registration:', error);
            setError('Registration failed'); // Set an error message
        }
    };

    return (
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={handleRegister}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign Up</h3>

                    <div className="form-group mt-3">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            style={{marginLeft: '47px'}}
                            className="form-control mt-1"
                            placeholder="Enter name"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group mt-3">
                        <label>Email</label>
                        <input
                            type="email"
                            style={{marginLeft: '50px'}}
                            name="email"
                            className="form-control mt-1"
                            placeholder="Enter email"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            style={{marginLeft: '21px'}}
                            name="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group mt-3">
                        <br />
                        <label>Security Question</label>
                        <br/>
                        <label>What is your favourite book?</label>
                        <input
                            type="text"
                            name="securityAnswer"
                            style={{marginTop: '6px'}}
                            className="form-control mt-1"
                            placeholder="Your security answer"
                            onChange={handleChange}
                        />
                    </div>

                    <div id="block_container">
                        <div
                            className="d-flex justify-content-between mt-3"
                            id="bloc1">
                            <div id="block1">
                                <p>
                                    Already a user? <a href="/login">Login</a>
                                </p>
                            </div>
                            <div className="d-grid gap-2" id="block2">
                                <button
                                    type="submit"
                                    className="btn btn-primary">
                                    Register
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

export default Register;
