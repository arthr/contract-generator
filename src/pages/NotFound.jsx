import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="py-10 flex flex-col items-center justify-center text-center">
      <img src="/contract-generator.svg" alt="Gerador de Contratos" className="w-32 h-32 mb-8 opacity-50" />
      <h2 className="text-4xl font-bold text-gray-800 mb-4">404 - Página não encontrada</h2>
      <p className="text-lg text-gray-600 mb-8">A página que você está procurando não existe ou foi movida.</p>
      <Link 
        to="/" 
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
      >
        Voltar para Home
      </Link>
    </div>
  );
}

export default NotFound; 