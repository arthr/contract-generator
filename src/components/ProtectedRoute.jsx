import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente para proteger rotas administrativas
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('authToken') && localStorage.getItem('isAdmin') === 'true';
  
  if (!isAuthenticated) {
    // Redireciona para a página de login se não estiver autenticado
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}

export default ProtectedRoute; 