import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarModelos } from '../../services/apiService';

function NovoContrato() {
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [termoBusca, setTermoBusca] = useState('');
  
  const tiposContrato = [
    { id: 'todos', label: 'Todos' },
    { id: 'prestacao-servicos', label: 'Prestação de Serviços' },
    { id: 'compra-venda', label: 'Compra e Venda' },
    { id: 'locacao', label: 'Locação' },
    { id: 'parceria', label: 'Parceria' },
    { id: 'confidencialidade', label: 'Confidencialidade' }
  ];
  
  useEffect(() => {
    const carregarModelos = async () => {
      try {
        setLoading(true);
        
        // Faz a chamada à API real
        const resultado = await listarModelos();
        
        // Se não houver modelos ou resultado for inválido, retorna lista vazia
        if (!resultado || !Array.isArray(resultado)) {
          setModelos([]);
          setLoading(false);
          return;
        }
        
        setModelos(resultado);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        setErro('Falha ao carregar os modelos de contrato.');
        
        // Dados simulados como fallback em caso de erro
        const modelosSimulados = [
          {
            _id: '67dd9c82222a5268ef840c7a',
            titulo: 'Contrato Modelo Base',
            tipo: 'confidencialidade',
            descricao: 'Modelo exemplar de funcionalidades e recursos',
            createdAt: '2023-06-15T14:30:45.123Z',
            updatedAt: '2023-06-15T14:30:45.123Z'
          },
          {
            _id: '67dd9c82222a5268ef840c7b',
            titulo: 'Contrato de Aluguel',
            tipo: 'locacao',
            descricao: 'Modelo para contratos de locação residencial',
            createdAt: '2023-05-20T10:15:30.456Z',
            updatedAt: '2023-05-20T10:15:30.456Z'
          },
          {
            _id: '67dd9c82222a5268ef840c7c',
            titulo: 'Contrato de Prestação de Serviços',
            tipo: 'prestacao-servicos',
            descricao: 'Modelo para contratos de prestação de serviços diversos',
            createdAt: '2023-04-10T09:00:15.789Z',
            updatedAt: '2023-04-10T09:00:15.789Z'
          }
        ];
        
        setModelos(modelosSimulados);
        setLoading(false);
      }
    };
    
    carregarModelos();
  }, []);
  
  const filtrarModelos = () => {
    return modelos.filter(modelo => {
      // Filtrar por tipo
      const tipoMatch = filtroTipo === 'todos' || modelo.tipo === filtroTipo;
      
      // Filtrar por termo de busca
      const buscarEm = `${modelo.titulo || ''} ${modelo.descricao || ''}`.toLowerCase();
      const termoMatch = !termoBusca || buscarEm.includes(termoBusca.toLowerCase());
      
      return tipoMatch && termoMatch;
    });
  };
  
  const modelosFiltrados = filtrarModelos();
  
  const formatarData = (dataString) => {
    if (!dataString) return 'Data não disponível';
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const getTipoLabel = (tipo) => {
    const tipoEncontrado = tiposContrato.find(t => t.id === tipo);
    return tipoEncontrado ? tipoEncontrado.label : tipo;
  };
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gerar Novo Contrato</h2>
        <p className="text-gray-600 mt-2">Selecione um modelo para gerar seu contrato.</p>
      </div>
      
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label htmlFor="termoBusca" className="block text-sm font-medium text-gray-700 mb-1">Buscar modelo</label>
            <input
              type="text"
              id="termoBusca"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite para buscar..."
            />
          </div>
          <div className="md:w-64">
            <label htmlFor="filtroTipo" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por tipo</label>
            <select
              id="filtroTipo"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tiposContrato.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : erro ? (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700 mb-6">
          {erro}
        </div>
      ) : modelosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modelosFiltrados.map((modelo) => (
            <div key={modelo._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{modelo.titulo}</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {getTipoLabel(modelo.tipo)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{modelo.descricao || 'Sem descrição disponível'}</p>
              </div>
              <div className="px-6 py-3 bg-gray-50 text-xs text-gray-700">
                <p>Criado em: {formatarData(modelo.createdAt)}</p>
                <p>Última atualização: {formatarData(modelo.updatedAt)}</p>
              </div>
              <div className="px-6 py-4 mt-auto">
                <Link 
                  to={`/gerar-contrato/${modelo._id}`}
                  className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Usar este modelo
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 mb-4">
            {termoBusca || filtroTipo !== 'todos' 
              ? 'Nenhum modelo encontrado com os filtros selecionados.' 
              : 'Não existem modelos de contrato disponíveis.'}
          </p>
          {termoBusca || filtroTipo !== 'todos' ? (
            <button
              onClick={() => {
                setTermoBusca('');
                setFiltroTipo('todos');
              }}
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Limpar filtros
            </button>
          ) : (
            <p className="text-gray-600">
              Entre em contato com um administrador para solicitar novos modelos.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default NovoContrato; 