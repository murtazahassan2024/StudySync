import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '/Users/murtazahassan/Desktop/StudySync/frontend/src/context/AuthContext.js';

export const getUserEmail = () => {
    return localStorage.getItem('userEmail');
};

export const getUserId = () => {
    return localStorage.getItem('userId');
};

export const getUserName = () => {
    return localStorage.getItem('userName');
}

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:8001/api/users/login',
                { email, password },
            );

            localStorage.setItem('userEmail', response.data.email);
            localStorage.setItem('userId', response.data._id);
            localStorage.setItem('userName', response.data.name);
            

            // Assuming 'login' function is from AuthContext and it's set up to handle the response
            login(response.data); // This function will set the user and email in the context



        navigate('/'); // Redirect the user to the home page or dashboard
    }  catch (error) {
            console.error('Error during login:', error.response || error.message);
            if (error.response && error.response.status === 401) {
                setError('The email or password is incorrect.');
            } else if (error.response) {
                setError('An error occurred. Please try again later.');
            } else if (error.request) {
                setError('No response from server. Check your network connection.');
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };



    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage:
                        'url(https://www.ketchum.edu/sites/default/files/2022-08/First%20%28Top%29%20Image%20.jpeg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={8} md={5} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign In
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleLogin}
                        sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}>
                            Sign In
                        </Button>
                        {error && (
                            <Typography variant="body2" color="error">
                                {error}
                            </Typography>
                        )}
                        
                        <Box mt={5}>
                            <Typography variant="body2">
                                New User? <a href="/register">Register</a>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Login;
