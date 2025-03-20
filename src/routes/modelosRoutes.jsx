import React from 'react';
import MainLayout from '../layouts/MainLayout';
import NotFound from '../pages/NotFound';
import { createDynamicRoute } from './routeUtils';

// Importando os componentes
import ListaModelos from '../pages/modelos/ListaModelos';
import NovoModelo from '../pages/modelos/NovoModelo';
import GerarContrato from '../pages/GerarContrato';

// Placeholder temporário para componentes que serão criados no futuro
const PlaceholderComponent = () => <div>Página em construção</div>;

/**
 * Configuração para rotas de modelos de contratos
 */
const modelosRoutes = [
  {
    path: '/modelos',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <ListaModelos />,
      },
      {
        path: 'novo',
        element: <NovoModelo />,
      },
      // Rota para visualizar um modelo específico
      createDynamicRoute(
        ':id', 
        PlaceholderComponent,
        { 
          caseSensitive: false,
        }
      ),
      // Rota para editar um modelo específico
      createDynamicRoute(
        ':id/editar', 
        PlaceholderComponent
      ),
    ],
  },
  // Rota para gerar contrato a partir de um modelo
  {
    path: '/gerar-contrato/:modeloId',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <GerarContrato />,
      }
    ]
  }
];

export default modelosRoutes; 