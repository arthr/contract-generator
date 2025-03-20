import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ListaModelos() {
  // Dados simulados de modelos de contratos
  const [modelos] = useState([
    {
      id: '1',
      titulo: 'Contrato de Prestação de Serviços',
      tipo: 'prestacao-servicos',
      descricao: 'Modelo padrão para prestação de serviços entre empresas ou autônomos.',
      variaveis: ['NOME_CONTRATANTE', 'NOME_CONTRATADO', 'CNPJ_CONTRATANTE', 'CNPJ_CONTRATADO', 'VALOR', 'PRAZO', 'DESCRICAO_SERVICO'],
      criadoEm: '2023-05-10',
      atualizadoEm: '2023-06-15'
    },
    {
      id: '2',
      titulo: 'Contrato de Locação Comercial',
      tipo: 'locacao',
      descricao: 'Modelo para locação de imóveis comerciais.',
      variaveis: ['NOME_LOCADOR', 'NOME_LOCATARIO', 'ENDERECO_IMOVEL', 'VALOR_ALUGUEL', 'PRAZO_CONTRATO', 'INDICE_REAJUSTE'],
      criadoEm: '2023-04-22',
      atualizadoEm: '2023-04-22'
    },
    {
      id: '3',
      titulo: 'Acordo de Confidencialidade',
      tipo: 'confidencialidade',
      descricao: 'Modelo de NDA para proteger informações confidenciais entre partes.',
      variaveis: ['PARTE_REVELADORA', 'PARTE_RECEPTORA', 'OBJETO_CONFIDENCIALIDADE', 'PRAZO_CONFIDENCIALIDADE', 'PENALIDADE'],
      criadoEm: '2023-03-05',
      atualizadoEm: '2023-07-12'
    },
  ]);

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Modelos de Contrato</h2>
        <Link 
          to="/modelos/novo" 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
        >
          <span className="mr-2">Novo Modelo</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      {modelos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modelos.map((modelo) => (
              <div key={modelo.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{modelo.titulo}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full uppercase">
                      {modelo.tipo === 'prestacao-servicos' && 'Prestação de Serviços'}
                      {modelo.tipo === 'locacao' && 'Locação'}
                      {modelo.tipo === 'confidencialidade' && 'Confidencialidade'}
                      {modelo.tipo === 'compra-venda' && 'Compra e Venda'}
                      {modelo.tipo === 'parceria' && 'Parceria'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{modelo.descricao}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Variáveis ({modelo.variaveis.length})</h4>
                    <div className="flex flex-wrap gap-1">
                      {modelo.variaveis.slice(0, 3).map((variavel, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {variavel}
                        </span>
                      ))}
                      {modelo.variaveis.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{modelo.variaveis.length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    <p>Criado em: {new Date(modelo.criadoEm).toLocaleDateString('pt-BR')}</p>
                    <p>Atualizado em: {new Date(modelo.atualizadoEm).toLocaleDateString('pt-BR')}</p>
                  </div>
                  
                  <div className="flex justify-between space-x-2">
                    <Link 
                      to={`/modelos/${modelo.id}`} 
                      className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                      Visualizar
                    </Link>
                    <Link 
                      to={`/modelos/${modelo.id}/editar`} 
                      className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                      Editar
                    </Link>
                    <Link 
                      to={`/gerar-contrato/${modelo.id}`} 
                      className="px-3 py-1.5 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors text-sm"
                    >
                      Gerar Contrato
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">Nenhum modelo de contrato encontrado.</p>
          <Link 
            to="/modelos/novo" 
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Criar Primeiro Modelo
          </Link>
        </div>
      )}
    </div>
  );
}

export default ListaModelos; 