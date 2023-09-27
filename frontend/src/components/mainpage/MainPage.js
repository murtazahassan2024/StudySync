import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
    return (
    <div>
        <h1>Main Page</h1>
        <p>This is the main page.</p>
        <Link to="/login">Login</Link>
    </div>
    );
};

export default MainPage;
