import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarContratosVigentes, obterModelo, downloadContrato } from '../../../services/contractService';

function ListarContratos() {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [modelosInfo, setModelosInfo] = useState({});
  const [termoBusca, setTermoBusca] = useState('');

  // Função para carregar informações adicionais de modelos
  const carregarInfoModelo = async (modeloId) => {
    try {
      // Verifica se já temos informações desse modelo
      if (modelosInfo[modeloId]) return modelosInfo[modeloId];

      const modelo = await obterModelo(modeloId);
      
      // Atualiza o cache de modelos
      setModelosInfo(prev => ({
        ...prev,
        [modeloId]: {
          titulo: modelo.titulo,
          tipo: modelo.tipo
        }
      }));
      
      return {
        titulo: modelo.titulo,
        tipo: modelo.tipo
      };
    } catch (error) {
      console.error(`Erro ao carregar informações do modelo ${modeloId}:`, error);
      return {
        titulo: 'Modelo não encontrado',
        tipo: 'desconhecido'
      };
    }
  };

  // Carrega a lista de contratos vigentes
  useEffect(() => {
    const carregarContratos = async () => {
      try {
        setLoading(true);
        
        // Faz a chamada à API real
        const resultado = await listarContratosVigentes();
        
        // Se não houver contratos, retorna uma lista vazia
        if (!resultado || !resultado.contratos) {
          setContratos([]);
          setLoading(false);
          return;
        }
        
        // Processa os contratos recebidos para incluir informações dos modelos
        const contratosProcessados = await Promise.all(
          resultado.contratos.map(async (contrato, index) => {
            // Obter informações do modelo para cada contrato
            const modeloInfo = await carregarInfoModelo(contrato.modeloId);
            
            // Retorna o contrato com as informações adicionais
            return {
              id: contrato.id || `contrato-${index}`, // Usar ID se disponível ou gerar um
              modeloId: contrato.modeloId,
              modeloTitulo: modeloInfo.titulo,
              modeloTipo: modeloInfo.tipo,
              parametros: contrato.parametros,
              identificadores: contrato.identificadoresCampos,
              hash: contrato.hash,
              versao: contrato.versao,
              dataGeracao: contrato.dataGeracao,
              arquivo: contrato.arquivo
            };
          })
        );
        
        setContratos(contratosProcessados);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar contratos:', error);
        setErro('Falha ao carregar a lista de contratos vigentes.');

        setLoading(false);
      }
    };
    
    carregarContratos();
  }, []);

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para obter o rótulo do tipo de contrato
  const getTipoLabel = (tipo) => {
    const tiposContrato = {
      'prestacao-servicos': 'Prestação de Serviços',
      'compra-venda': 'Compra e Venda',
      'locacao': 'Locação',
      'parceria': 'Parceria',
      'confidencialidade': 'Confidencialidade'
    };
    
    return tiposContrato[tipo] || tipo;
  };

  const handleDownload = async (contrato) => {
    try {
      const blob = await downloadContrato(contrato.modeloId, contrato.hash);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = contrato.arquivo.nome;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar o contrato:', error);
      // Aqui você pode adicionar uma notificação de erro se desejar
    }
  };

  // Função para filtrar contratos baseado no termo de busca
  const filtrarContratos = (contratos) => {
    if (!termoBusca) return contratos;
    
    const termo = termoBusca.toLowerCase();
    return contratos.filter(contrato => {
      const identificadores = contrato.identificadores || {};
      return (
        identificadores.primario?.toLowerCase().includes(termo) ||
        identificadores.secundario?.toLowerCase().includes(termo) ||
        contrato.modeloTitulo?.toLowerCase().includes(termo)
      );
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Meus Contratos</h2>
          <p className="mt-1">Visualize e baixe seus contratos gerados</p>
        </div>
        <Link 
          to="novo" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <span className="mr-2">Gerar Novo Contrato</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : erro ? (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700 mb-6">
          {erro}
        </div>
      ) : (
        //border border-slate-300 dark:border-slate-600 rounded-lg p-4 min-h-[500px] flex items-center justify-center bg-white dark:bg-slate-800
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Buscar por identificador ou modelo..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {filtrarContratos(contratos).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificadores</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parâmetros</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versão</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Geração</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtrarContratos(contratos).map((contrato) => (
                    <tr key={contrato.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{contrato.modeloTitulo}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <span>ID: {contrato.modeloId}</span>
                          {contrato.modeloTipo && (
                            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                              {getTipoLabel(contrato.modeloTipo)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {contrato.identificadores && (
                            <>
                              <div className="mb-1">
                                <span className="font-medium">Primário:</span>{' '}
                                <span className="text-blue-600">{contrato.identificadores.primario.toUpperCase() || '-'}</span>
                              </div>
                              <div>
                                <span className="font-medium">Secundário:</span>{' '}
                                <span className="text-blue-600">{contrato.identificadores.secundario || '-'}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {Object.entries(contrato.parametros).map(([chave, valor]) => (
                            <div key={chave} className="mb-1">
                              <span className="font-medium">{chave}:</span> {valor}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          v{contrato.versao}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {formatarData(contrato.dataGeracao)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button 
                            onClick={() => handleDownload(contrato)}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Baixar
                          </button>
                          <Link 
                            to={`gerar/${contrato.modeloId}`} 
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Regenerar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum contrato encontrado</h3>
              <p className="mt-1 text-gray-500">
                {termoBusca ? 'Tente ajustar seu filtro de busca.' : 'Você ainda não gerou nenhum contrato.'}
              </p>
              {!termoBusca && (
                <div className="mt-6">
                  <Link
                    to="/contratos/novo"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Gerar Primeiro Contrato
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ListarContratos; 