import React from 'react';
import MainLayout from '../layouts/MainLayout';
import NotFound from '../pages/NotFound';
import { createDynamicRoute } from './routeUtils';

// Importando os componentes de contratos
import NovoContrato from '../pages/contratos/NovoContrato';
import ListaContratos from '../pages/contratos/ListaContratos';

// Estes componentes seriam criados futuramente
// import DetalhesContrato from '../pages/contratos/DetalhesContrato';
// import EditarContrato from '../pages/contratos/EditarContrato';

// Placeholder temporário para simulação
const PlaceholderComponent = () => <div>Página em construção</div>;

/**
 * Configuração para rotas de contratos
 */
const contratosRoutes = [
  {
    path: '/contratos',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <ListaContratos />,
      },
      // Rota para visualizar detalhes de um contrato específico
      createDynamicRoute(
        '/contratos/:id', 
        // DetalhesContrato,
        PlaceholderComponent,
        { 
          // Exemplo de propriedades adicionais que podem ser definidas
          caseSensitive: false,
        }
      ),
      // Rota para editar um contrato específico
      createDynamicRoute(
        '/contratos/:id/editar', 
        // EditarContrato,
        PlaceholderComponent
      ),
      // Rota para criar um novo contrato
      {
        path: '/contratos/novo',
        element: <NovoContrato />,
      },
    ],
  },
];

export default contratosRoutes; 