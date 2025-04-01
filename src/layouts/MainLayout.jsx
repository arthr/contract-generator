import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

function MainLayout() {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  
  // Verificar se o usuário está autenticado como admin
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('authToken');
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(authToken && adminStatus);
    };
    
    checkAuth();
    // Adicionar um event listener para mudanças no localStorage
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  // Determinar se estamos na área administrativa
  const isAdminArea = location.pathname.startsWith('/admin');
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/contract-generator.svg" alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold m-0">Contract Generator</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><Link to="/" className="text-white hover:text-gray-300 transition-colors">Home</Link></li>
              {/* Link para Contratos é público */}
              <li><Link to="/contratos" className="text-white hover:text-gray-300 transition-colors">Contratos</Link></li>
              
              {/* Links para área administrativa, visíveis apenas para admins */}
              {isAdmin && (
                <>
                  <li><Link to="/admin/modelos" className="text-white hover:text-gray-300 transition-colors">Gerenciar Modelos</Link></li>
                  <li>
                    <button 
                      onClick={() => {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('isAdmin');
                        window.location.href = '/';
                      }}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      Sair
                    </button>
                  </li>
                </>
              )}
              
              {/* Link para login admin, visível apenas para não-admins e fora da área administrativa */}
              {!isAdmin && !isAdminArea && (
                <li><Link to="/admin/login" className="text-white hover:text-gray-300 transition-colors">Área Admin</Link></li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-5">
          <Outlet />
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-4 text-center">
        <div className="container mx-auto px-5">
          <p className="m-0">&copy; {new Date().getFullYear()} Contract Generator. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout; 