import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarContratosVigentes, obterModelo, downloadContrato } from '../../services/apiService';

function ListaContratos() {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [modelosInfo, setModelosInfo] = useState({});

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
        
        // Usa dados simulados como fallback em caso de erro
        const dadosSimulados = [
          {
            id: '1',
            modeloId: '67dd9c82222a5268ef840c7a',
            modeloTitulo: 'Contrato Modelo Base',
            modeloTipo: 'confidencialidade',
            parametros: {
              id_cliente: 12345,
              id_contrato: 5678
            },
            versao: 2,
            dataGeracao: '2023-06-15T14:30:45.123Z',
            arquivo: {
              nome: 'Contrato_Servico_12345_v2.docx',
              url: '/uploads/contratos-gerados/Contrato_Servico_12345_v2.docx',
            }
          },
          {
            id: '2',
            modeloId: '67dd9c82222a5268ef840c7a',
            modeloTitulo: 'Contrato Modelo Base',
            modeloTipo: 'confidencialidade',
            parametros: {
              id_cliente: 12346,
              id_contrato: 5679
            },
            versao: 1,
            dataGeracao: '2023-05-20T10:15:30.456Z',
            arquivo: {
              nome: 'Contrato_Servico_12346_v1.docx',
              url: '/uploads/contratos-gerados/Contrato_Servico_12346_v1.docx',
            }
          }
        ];
        
        setContratos(dadosSimulados);
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

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Meus Contratos</h2>
          <p className="text-gray-600 mt-1">Visualize e baixe seus contratos gerados</p>
        </div>
        <Link 
          to="/contratos/novo" 
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
      ) : contratos.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parâmetros</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versão</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Geração</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contratos.map((contrato) => (
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
                        to={`/gerar-contrato/${contrato.modeloId}`} 
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
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 mb-4">Você ainda não gerou nenhum contrato.</p>
          <Link 
            to="/contratos/novo" 
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Gerar Seu Primeiro Contrato
          </Link>
        </div>
      )}
    </div>
  );
}

export default ListaContratos; 