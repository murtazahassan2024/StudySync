import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Grid, Box, Avatar, Container, Link } from '@mui/material';

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
            const response = await axios.post('http://localhost:8001/api/users/', formData);
            localStorage.setItem('userToken', response.data.token);
            navigate('/login');
        } catch (err) {
            console.error('Error during registration:', err);
            setError('Registration failed');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                autoComplete="name"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="securityAnswer"
                                label="Security Answer (What is your favourite book?)"
                                type="text"
                                id="securityAnswer"
                                autoComplete="off"
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                    {error && (
                        <Typography variant="body2" color="error" align="center">
                            {error}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
