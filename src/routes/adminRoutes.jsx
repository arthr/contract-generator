import React from 'react';
import MainLayout from '../layouts/MainLayout';
import NotFound from '../pages/NotFound';
import Login from '../pages/admin/Login';
import ProtectedRoute from '../components/ProtectedRoute';
import { createDynamicRoute } from './routeUtils';

// Importando os componentes administrativos de modelos
import ListaModelos from '../pages/admin/modelos/ListaModelos';
import NovoModelo from '../pages/admin/modelos/NovoModelo';
import VisualizarModelo from '../pages/admin/modelos/VisualizarModelo';
import EditarModelo from '../pages/admin/modelos/EditarModelo';
// Quando criarmos as páginas administrativas para visualizar e editar
// import VisualizarModelo from '../pages/admin/modelos/VisualizarModelo';
// import EditarModelo from '../pages/admin/modelos/EditarModelo';

/**
 * Configuração para rotas administrativas
 */
const adminRoutes = [
  // Rota pública de login
  {
    path: '/admin/login',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  // Rotas protegidas da área administrativa de modelos
  {
    path: '/admin/modelos',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <ProtectedRoute><ListaModelos /></ProtectedRoute>,
      },
      {
        path: 'novo',
        element: <ProtectedRoute><NovoModelo /></ProtectedRoute>,
      },
      // Rota para visualizar um modelo específico
      createDynamicRoute(
        ':id', 
        (params) => (
          <ProtectedRoute>
            <VisualizarModelo />
          </ProtectedRoute>
        ),
        { 
          caseSensitive: false,
        }
      ),
      // Rota para editar um modelo específico
      createDynamicRoute(
        'editar/:id', 
        (params) => (
          <ProtectedRoute>
            <EditarModelo />
          </ProtectedRoute>
        )
      ),
    ],
  },
];

export default adminRoutes; 