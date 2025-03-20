import { createBrowserRouter } from 'react-router-dom';

// Importando rotas
import publicRoutes from './publicRoutes';
import contratosRoutes from './contratosRoutes';
import modelosRoutes from './modelosRoutes';

// Combinando todas as rotas em um único array
const routes = [
  ...publicRoutes,
  ...modelosRoutes,
  ...contratosRoutes,
  // No futuro podemos adicionar outras categorias de rotas aqui:
  // ...adminRoutes,
  // ...authRoutes,
  // ...dashboardRoutes,
];

// Criando o router
const router = createBrowserRouter(routes);

export default router; 