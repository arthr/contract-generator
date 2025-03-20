import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ListaContratos() {
  // Dados simulados de contratos
  const [contratos] = useState([
    {
      id: '1',
      titulo: 'Contrato de Desenvolvimento de Software',
      tipo: 'prestacao-servicos',
      parteA: 'Empresa ABC Ltda',
      parteB: 'DevTech Solutions',
      valor: 'R$ 75.000,00',
      dataInicio: '2023-06-15',
      status: 'ativo'
    },
    {
      id: '2',
      titulo: 'Contrato de Locação Comercial',
      tipo: 'locacao',
      parteA: 'Imobiliária Central',
      parteB: 'Empresa ABC Ltda',
      valor: 'R$ 4.500,00/mês',
      dataInicio: '2023-01-10',
      status: 'ativo'
    },
    {
      id: '3',
      titulo: 'Acordo de Confidencialidade',
      tipo: 'confidencialidade',
      parteA: 'Empresa ABC Ltda',
      parteB: 'Consultoria XYZ',
      valor: 'N/A',
      dataInicio: '2023-03-22',
      status: 'ativo'
    },
  ]);

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Contratos</h2>
        <Link 
          to="/contratos/novo" 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
        >
          <span className="mr-2">Novo Contrato</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      {contratos.length > 0 ? (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partes</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Início</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contratos.map((contrato) => (
                  <tr key={contrato.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contrato.titulo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {contrato.tipo === 'prestacao-servicos' && 'Prestação de Serviços'}
                        {contrato.tipo === 'locacao' && 'Locação'}
                        {contrato.tipo === 'confidencialidade' && 'Confidencialidade'}
                        {contrato.tipo === 'compra-venda' && 'Compra e Venda'}
                        {contrato.tipo === 'parceria' && 'Parceria'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        <div>{contrato.parteA}</div>
                        <div className="text-gray-500">{contrato.parteB}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{contrato.valor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {new Date(contrato.dataInicio).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {contrato.status === 'ativo' ? 'Ativo' : contrato.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/contratos/${contrato.id}`} className="text-blue-600 hover:text-blue-900">
                          Ver
                        </Link>
                        <Link to={`/contratos/${contrato.id}/editar`} className="text-indigo-600 hover:text-indigo-900">
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">Nenhum contrato encontrado.</p>
          <Link 
            to="/contratos/novo" 
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Criar Primeiro Contrato
          </Link>
        </div>
      )}
    </div>
  );
}

export default ListaContratos; 