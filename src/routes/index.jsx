import { createBrowserRouter } from 'react-router-dom';

// Importando rotas
import publicRoutes from './publicRoutes';
import contratosRoutes from './contratosRoutes';
import adminRoutes from './adminRoutes';

// Combinando todas as rotas em um único array
const routes = [
  ...publicRoutes,
  ...contratosRoutes,
  // Rotas administrativas
  ...adminRoutes,
  // As rotas de modelos agora são acessíveis apenas da área administrativa
  // ...modelosRoutes,
];

// Criando o router
const router = createBrowserRouter(routes);

export default router; 