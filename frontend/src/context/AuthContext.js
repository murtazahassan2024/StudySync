import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);  // It's important to set a default value

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

const login = (userData) => {
  localStorage.setItem('userToken', userData.token);
  localStorage.setItem('user', JSON.stringify(userData.user)); // Store the user details
  setUser(userData.user);
};


    const logout = () => {
        localStorage.removeItem('userToken');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
