import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="py-5">
      <div className="text-center mb-12">
        <img src="/contract-generator.svg" alt="Gerador de Contratos" className="w-24 h-24 mx-auto mb-6" />
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Gerador de Contratos</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Gere documentos contratuais prontos para uso em segundos a partir de modelos pré-configurados.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <div className="text-blue-500 text-3xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Modelos Disponíveis</h3>
          <p className="text-gray-700 mb-4">
            Acesse diversos modelos de contratos prontos para diferentes
            tipos de negócios e necessidades.
          </p>
          <Link 
            to="/contratos/novo" 
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Gerar um contrato →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <div className="text-green-500 text-3xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalização Simples</h3>
          <p className="text-gray-700 mb-4">
            Preencha variáveis específicas nos modelos para personalizar
            seus contratos de forma rápida e eficiente.
          </p>
          <Link 
            to="/contratos/novo" 
            className="text-green-500 hover:text-green-700 font-medium"
          >
            Personalizar contrato →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <div className="text-purple-500 text-3xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Geração Instantânea</h3>
          <p className="text-gray-700 mb-4">
            Selecione um modelo, preencha as variáveis e gere um 
            contrato pronto para impressão ou download em segundos.
          </p>
          <Link 
            to="/contratos/novo" 
            className="text-purple-500 hover:text-purple-700 font-medium"
          >
            Gerar um contrato →
          </Link>
        </div>
      </div>
      
      <div className="bg-gray-100 rounded-lg p-8 my-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Como funciona?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-lg font-semibold mb-2">Escolha um modelo</h3>
            <p className="text-gray-700">
              Selecione entre diversos modelos de contratos 
              pré-configurados disponíveis na plataforma.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-lg font-semibold mb-2">Preencha as informações</h3>
            <p className="text-gray-700">
              Informe os dados necessários para personalizar
              seu contrato conforme sua necessidade.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-lg font-semibold mb-2">Obtenha seu contrato</h3>
            <p className="text-gray-700">
              Baixe ou imprima seu contrato personalizado 
              pronto para uso imediato.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center my-12">
        <Link 
          to="/contratos/novo" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-md transition-colors text-lg"
        >
          Gerar Contrato Agora
        </Link>
      </div>
      
      {/* Link para área administrativa (apenas para demonstração) */}
      <div className="text-center mt-16 text-sm text-gray-500">
        <Link to="/admin/login" className="text-gray-500 hover:text-gray-700">
          Área Administrativa
        </Link>
      </div>
    </div>
  );
}

export default Home; 