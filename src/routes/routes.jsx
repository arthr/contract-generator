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

// React Icons
import { HiChartPie, HiFolderOpen, HiCog, HiViewGrid } from 'react-icons/hi';
import { HiMiniChartPie, HiWrenchScrewdriver } from 'react-icons/hi2';
import { LiaFileContractSolid } from 'react-icons/lia';
import { TbContract } from 'react-icons/tb';

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
                icon: LiaFileContractSolid,
                showInMenu: true
            },
            {
                path: 'contratos/novo',
                component: NovoContrato,
                title: 'Novo Contrato',
                breadcrumbTitle: 'Novo Contrato',
                icon: LiaFileContractSolid,
                showInMenu: false
            },
            {
                path: 'contratos/gerar/:modeloId',
                component: GerarContrato,
                title: 'Gerar Contrato',
                breadcrumbTitle: 'Gerar Contrato',
                icon: LiaFileContractSolid,
                showInMenu: false
            },
            {
                path: 'modelos',
                component: ListarModelos,
                title: 'Modelos',
                breadcrumbTitle: 'Modelos',
                icon: TbContract,
                showInMenu: true
            },
            {
                path: 'modelos/:modeloId',
                component: VisualizarModelo,
                title: 'Visualizar Modelo',
                breadcrumbTitle: 'Visualizar Modelo',
                icon: TbContract,
                showInMenu: false
            },
            {
                path: 'modelos/novo',
                component: NovoModelo,
                title: 'Novo Modelo',
                breadcrumbTitle: 'Novo Modelo',
                icon: TbContract,
                showInMenu: false
            },
            {
                path: 'modelos/editar/:modeloId',
                component: EditarModelo,
                title: 'Editar Modelo',
                breadcrumbTitle: 'Editar Modelo',
                icon: TbContract,
                showInMenu: false
            },

            // Rotas Exemplares
            {
                path: 'editor',
                component: Editor,
                title: 'Editor',
                icon: HiWrenchScrewdriver,
                showInMenu: false
            },
            {
                path: 'upload',
                component: Upload,
                title: 'Upload',
                breadcrumbTitle: 'Upload (envio de modelos)',
                icon: HiFolderOpen,
                showInMenu: false
            },
            {
                path: 'grids',
                component: Grids,
                title: 'Grids',
                icon: HiViewGrid,
                showInMenu: false
            },
            {
                path: 'settings',
                component: () => <div>
                    <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
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
                showInMenu: false
            }
        ]
    }
];

export default routes;