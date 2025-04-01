import NotFound from '../pages/NotFound';

import Home from '../pages/public/Home';

import Dashboard from '../pages/private/Dashboard';

import ListarContratos from '../pages/private/contratos/ListarContratos';
import NovoContrato from '../pages/private/contratos/NovoContrato';
import GerarContrato from '../pages/private/contratos/GerarContrato';

import ListarModelos from '../pages/private/modelos/ListarModelos';
import VisualizarModelo from '../pages/private/modelos/VisualizarModelo';
import NovoModelo from '../pages/private/modelos/NovoModelo';
import EditarModelo from '../pages/private/modelos/EditarModelo';

import Editor from '../pages/private/Editor';
import Upload from '../pages/private/Upload';
import Grids from '../pages/private/Grids';

import { HiChartPie, HiFolderOpen, HiCog, HiViewGrid } from 'react-icons/hi';
import { HiMiniChartPie, HiWrenchScrewdriver, HiOutlineDocumentText } from 'react-icons/hi2';

const routes = [
    {
        routeType: "public",
        routePrefix: null,
        routes: [
            {
                path: '/',
                component: Home,
                title: 'Home',
                breadcrumbTitle: 'Página Inicial',
                icon: HiChartPie,
                showInMenu: true
            }
        ]
    },
    {
        routeType: "private",
        routePrefix: '/admin',
        breadcrumbTitle: 'Início',
        routes: [
            {
                path:'*',
                component: NotFound,
                title: 'Página não encontrada',
                showInMenu: false
            },
            {
                path: '',
                component: Dashboard,
                title: 'Dashboard',
                breadcrumbTitle: 'Dashboard',
                icon: HiMiniChartPie,
                showInMenu: true
            },
            {
                path: 'contratos',
                component: ListarContratos,
                title: 'Contratos',
                breadcrumbTitle: 'Contratos',
                icon: HiOutlineDocumentText,
                showInMenu: true
            },
            {
                path: 'contratos/novo',
                component: NovoContrato,
                title: 'Novo Contrato',
                breadcrumbTitle: 'Novo Contrato',
                icon: HiOutlineDocumentText,
                showInMenu: false
            },
            {
                path: 'contratos/gerar/:modeloId',
                component: GerarContrato,
                title: 'Gerar Contrato',
                breadcrumbTitle: 'Gerar Contrato',
                icon: HiOutlineDocumentText,
                showInMenu: false
            },
            {
                path: 'modelos',
                component: ListarModelos,
                title: 'Modelos',
                breadcrumbTitle: 'Modelos',
                icon: HiOutlineDocumentText,
                showInMenu: true
            },
            {
                path: 'modelos/:modeloId',
                component: VisualizarModelo,
                title: 'Visualizar Modelo',
                breadcrumbTitle: 'Visualizar Modelo',
                icon: HiOutlineDocumentText,
                showInMenu: false
            },
            {
                path: 'modelos/novo',
                component: NovoModelo,
                title: 'Novo Modelo',
                breadcrumbTitle: 'Novo Modelo',
                icon: HiOutlineDocumentText,
                showInMenu: false
            },
            {
                path: 'modelos/editar/:modeloId',
                component: EditarModelo,
                title: 'Editar Modelo',
                breadcrumbTitle: 'Editar Modelo',
                icon: HiOutlineDocumentText,
                showInMenu: false
            },
            {
                path: 'editor',
                component: Editor,
                title: 'Editor',
                icon: HiWrenchScrewdriver,
                showInMenu: true
            },
            {
                path: 'upload',
                component: Upload,
                title: 'Upload',
                breadcrumbTitle: 'Upload (envio de modelos)',
                icon: HiFolderOpen,
                showInMenu: true
            },
            {
                path: 'grids',
                component: Grids,
                title: 'Grids',
                icon: HiViewGrid,
                showInMenu: true
            },
            {
                path: 'settings',
                component: () => <div>
                    <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                        Configurações
                    </h1>
                    <div
                        className="border border-slate-300 dark:border-slate-600 rounded-lg p-8 bg-white dark:bg-slate-800"
                    >
                        <p className="text-slate-500 dark:text-slate-400">Área de Configurações</p>
                    </div>
                </div>,
                title: 'Configurações',
                icon: HiCog,
                showInMenu: true
            }
        ]
    }
];

export default routes;