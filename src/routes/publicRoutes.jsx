import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Sobre from '../pages/Sobre';
import Contato from '../pages/Contato';
import NotFound from '../pages/NotFound';

const publicRoutes = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'sobre',
        element: <Sobre />,
      },
      {
        path: 'contato',
        element: <Contato />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default publicRoutes; 