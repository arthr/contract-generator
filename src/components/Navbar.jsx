import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMenu, HiSearch } from 'react-icons/hi';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/auth';
import { useLayout } from '../contexts/layout';
import {
    Avatar,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarToggle,
    Button,
    DarkThemeToggle,
    TextInput
} from 'flowbite-react';

function NavbarComponent({ isAuthenticated }) {
    const { logout, user } = useAuth();
    const { toggleSidebar, searchQuery, setSearchQuery, isMobile } = useLayout();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <Navbar fluid className="fixed w-full z-50 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex flex-wrap items-center justify-between w-full">
                <div className="flex items-center">
                    {/* Botão de menu para dispositivos móveis */}
                    {isAuthenticated && (
                        <Button
                            color="transparent"
                            className="p-2 mr-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                            onClick={toggleSidebar}
                        >
                            <HiMenu className="w-6 h-6" />
                            <span className="sr-only">Toggle sidebar</span>
                        </Button>
                    )}

                    {/* Logo e nome da aplicação */}
                    <NavbarBrand href="/">
                        <img src="/contract-generator.svg" className="mr-3 h-8" alt="Contract Generator Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Contract Generator</span>
                    </NavbarBrand>

                    {/* Barra de pesquisa - visível apenas em desktop */}
                    {(isAuthenticated && !isMobile) && (
                        <div className="hidden md:block ml-5">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <HiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </div>
                                <TextInput
                                    id="search"
                                    type="search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Buscar modelos..."
                                    className="pl-10"
                                    sizing="sm"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Área direita: botões de ação e menu do usuário */}
                <div className="flex items-center gap-2">

                    {/* Botão de toggle da navbar em dispositivos móveis */}
                    {isAuthenticated && (<NavbarToggle barIcon={HiSearch} />)}

                    {/* Toggle de tema escuro */}
                    <DarkThemeToggle />

                    {/* Menu do usuário */}
                    {isAuthenticated && (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt="Perfil do usuário"
                                    img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                    rounded
                                    bordered
                                />
                            }
                        >
                            <DropdownHeader>
                                <span className="block text-sm">{user?.username || 'Visitante'}</span>
                                <span className="block truncate text-sm font-medium">usuario@diretacapital.com.br</span>
                            </DropdownHeader>
                            <DropdownItem onClick={() => navigate('/profile')}>Meu Perfil</DropdownItem>
                            <DropdownItem onClick={() => navigate('/settings')}>Configurações</DropdownItem>
                            <DropdownDivider />
                            <DropdownItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                                <div className="flex items-center gap-2">
                                    <FiLogOut size={16} />
                                    Sair
                                </div>
                            </DropdownItem>
                        </Dropdown>
                    )}

                </div>
            </div>

            {/* Links de navegação na versão colapsada (mobile) */}
            {isAuthenticated && (
                <NavbarCollapse>
                    <div className="p-2 md:hidden">
                        <TextInput
                            id="mobile-search"
                            type="search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Buscar modelos..."
                            className="mb-4"
                        />
                    </div>
                </NavbarCollapse>
            )}
        </Navbar>
    );
}

export default NavbarComponent;
