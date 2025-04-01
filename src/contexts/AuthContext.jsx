import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (localStorage.getItem('authToken')) {
                    // TODO: Implementar verificação de token real
                    // Temporariamente, vamos recuperar o nome de usuário do localStorage
                    const storedUsername = localStorage.getItem('username');
                    if (storedUsername) {
                        const userData = { username: storedUsername };
                        setUser(userData);
                    }
                }
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error);
                localStorage.removeItem('authToken');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        const result = await authService.login(credentials);
        console.log('Login bem-sucedido, dados recebidos:', result);

        // Armazenar o nome de usuário no localStorage para persistência
        localStorage.setItem('username', credentials.username);

        setUser(result.user);
        return result;
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
