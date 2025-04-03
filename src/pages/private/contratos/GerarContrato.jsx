import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  obterModelo,
  obterDadosContrato,
  gerarContrato,
  obterHistoricoContratos,
  downloadModelo,
  downloadContrato
} from '../../../services/contractService';

function GerarContrato() {
  const { modeloId } = useParams();
  const navigate = useNavigate();

  const [modelo, setModelo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parametros, setParametros] = useState({});
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [dadosContrato, setDadosContrato] = useState(null);
  const [contratoGerado, setContratoGerado] = useState(null);
  const [forcarRegeneracao, setForcarRegeneracao] = useState(false);
  const [historicoContratos, setHistoricoContratos] = useState([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [historicoLoading, setHistoricoLoading] = useState(false);

  // Função auxiliar para extrair parâmetros de uma query SQL
  const extrairParametrosQuery = (query) => {
    if (!query) return [];

    const regex = /:\w+/g;
    const matches = query.match(regex) || [];

    // Remove os dois pontos do início de cada parâmetro
    return [...new Set(matches.map(param => param.substring(1)))];
  };

  // Buscar informações do modelo
  useEffect(() => {
    const fetchModelo = async () => {
      try {
        setLoading(true);
        const modeloData = await obterModelo(modeloId);
        setModelo(modeloData);

        // Extrair parâmetros da query principal
        const parametrosPrincipais = extrairParametrosQuery(modeloData.queryPrincipal);

        // Extrair parâmetros das queries das variáveis
        const parametrosVariaveis = modeloData.variaveis
          .filter(variavel => variavel.query)
          .flatMap(variavel => extrairParametrosQuery(variavel.query));

        // Combinar e remover duplicatas
        const todosParametros = [...new Set([...parametrosPrincipais, ...parametrosVariaveis])];

        // Inicializar parâmetros vazios
        const parametrosIniciais = {};
        todosParametros.forEach(param => {
          parametrosIniciais[param] = '';
        });

        setParametros(parametrosIniciais);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar modelo:', error);
        alert(`Erro ao buscar modelo: ${error.message}`);
        //navigate('/modelos');
      }
    };

    fetchModelo();
  }, [modeloId, navigate]);

  const handleChange = (param, valor) => {
    setParametros(prev => ({
      ...prev,
      [param]: valor
    }));

    // Limpa o erro quando o usuário começa a digitar
    if (errors[param]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[param];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    // Verifica se todos os parâmetros foram preenchidos
    Object.entries(parametros).forEach(([param]) => {
      if (!parametros[param] || parametros[param].trim() === '') {
        newErrors[param] = `O campo ${param.replace(/_/g, ' ').toLowerCase()} é obrigatório`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const previewDados = async () => {
    if (validate()) {
      try {
        setPreviewLoading(true);
        const dados = await obterDadosContrato(modeloId, parametros);
        setDadosContrato(dados.dados);
        setPreview(true);
        setPreviewLoading(false);
      } catch (error) {
        console.error('Erro ao obter dados para o contrato:', error);
        alert(`Erro ao obter dados para o contrato: ${error.message}`);
        setPreviewLoading(false);
      }
    }
  };

  const gerarContratoDocx = async () => {
    try {
      setPreviewLoading(true);
      const { contrato, arquivo } = await gerarContrato(modeloId, parametros, forcarRegeneracao);
      setContratoGerado({
        contrato,
        arquivo
      });
      setPreviewLoading(false);
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
      alert(`Erro ao gerar contrato: ${error.message}`);
      setPreviewLoading(false);
    }
  };

  const buscarHistoricoContratos = async () => {
    try {
      setHistoricoLoading(true);
      const resultado = await obterHistoricoContratos(modeloId, parametros);
      setHistoricoContratos(resultado.historico || []);
      setMostrarHistorico(true);
      setHistoricoLoading(false);
    } catch (error) {
      console.error('Erro ao obter histórico de contratos:', error);
      alert(`Erro ao obter histórico: ${error.message}`);
      setHistoricoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!preview) {
      await previewDados();
    } else if (preview && !contratoGerado) {
      await gerarContratoDocx();
    } else {
      navigate('/admin/contratos');
    }
  };

  const voltarAoFormulario = () => {
    setPreview(false);
    setDadosContrato(null);
    setContratoGerado(null);
    setMostrarHistorico(false);
    setHistoricoContratos([]);
  };

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

  const handleDownload = async () => {
    try {
      const blob = await downloadContrato(contratoGerado.contrato.modeloId, contratoGerado.contrato.hash);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = contratoGerado.arquivo.nome;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar o contrato:', error);
      // Aqui você pode adicionar uma notificação de erro se desejar
    }
  };

  const handleDownloadModelo = async () => {
    try {
      const blob = await downloadModelo(modeloId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = modelo.caminhoTemplate.split('/').pop(); // Pega o nome do arquivo do caminho
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar o modelo:', error);
      // Aqui você pode adicionar uma notificação de erro se desejar
    }
  };

  if (loading) {
    return (
      <div className="py-6 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-60 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {preview
            ? (contratoGerado
              ? 'Contrato Gerado com Sucesso'
              : 'Pré-visualização dos Dados')
            : `Gerar Contrato: ${modelo.titulo}`}
        </h2>
        <p className="text-gray-600 mt-2">
          {preview
            ? (contratoGerado
              ? 'Seu contrato foi gerado e está pronto para download.'
              : 'Confira os dados que serão usados para gerar o contrato.')
            : 'Preencha os parâmetros necessários para as queries SQL.'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        {modelo && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{modelo.titulo}</h2>
                <p className="text-gray-600 mt-1">{modelo.descricao}</p>
              </div>
              <button
                onClick={handleDownloadModelo}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar Modelo
              </button>
            </div>
          </div>
        )}
        {mostrarHistorico ? (
          // Visualização do histórico de contratos
          <div>
            <h3 className="text-xl font-semibold mb-4">Histórico de Contratos</h3>

            {historicoLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : historicoContratos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versão</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Geração</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arquivo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historicoContratos.map((contrato) => (
                      <tr key={contrato.versao} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contrato.versao}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarData(contrato.dataGeracao)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${contrato.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {contrato.ativo ? 'Ativo' : 'Substituído'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          <a
                            onClick={handleDownload}
                            className="flex items-center hover:underline"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {contrato.arquivo.nome}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum contrato encontrado com os parâmetros informados.</p>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setMostrarHistorico(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Voltar
              </button>
            </div>
          </div>
        ) : !preview ? (
          // Formulário para preencher os parâmetros
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.keys(parametros).length > 0 ? (
                Object.keys(parametros).map((param) => (
                  <div key={param} className="mb-2">
                    <label htmlFor={param} className="block text-gray-700 font-medium mb-2">
                      {param.replace(/_/g, ' ').toLowerCase()}*
                    </label>
                    <input
                      type="text"
                      id={param}
                      value={parametros[param] || ''}
                      onChange={(e) => handleChange(param, e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[param] ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors[param] && (
                      <p className="text-red-500 text-sm mt-1">{errors[param]}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-4">
                  <p className="text-gray-500 italic">Este modelo não possui parâmetros necessários.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => navigate('/admin/contratos')}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={buscarHistoricoContratos}
                  disabled={!Object.values(parametros).some(val => val.trim() !== '') || historicoLoading}
                  className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${Object.values(parametros).some(val => val.trim() !== '') ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'}`}
                >
                  {historicoLoading ? 'Carregando...' : 'Ver Histórico'}
                </button>
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Pré-visualizar Dados
              </button>
            </div>
          </form>
        ) : contratoGerado ? (
          // Tela de contrato gerado com sucesso
          <div className="flex flex-col items-center">
            <div className="mb-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Contrato gerado com sucesso!</h3>
              <p className="text-gray-600">Seu contrato está pronto para download.</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <p className="text-sm mb-2"><strong>Nome do arquivo:</strong> {contratoGerado.arquivo.nome}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                onClick={handleDownload}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar Contrato
              </a>
              <button
                type="button"
                onClick={() => navigate('/admin/contratos')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          // Preview dos dados
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Dados do Contrato</h3>

              {dadosContrato && (
                <div className="space-y-6">
                  {dadosContrato.principal && dadosContrato.principal.length > 0 && (
                    <div className="bg-gray-100 p-4 rounded-md">
                      <h4 className="font-medium mb-2">Dados Principais</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(dadosContrato.principal[0]).map(([chave, valor]) => (
                          <div key={chave}>
                            <span className="text-gray-700 font-medium">{chave}:</span>{' '}
                            <span>{typeof valor === 'object' ? JSON.stringify(valor) : valor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {dadosContrato.variaveis && Object.entries(dadosContrato.variaveis).map(([chave, dados]) => (
                    <div key={chave} className="bg-gray-100 p-4 rounded-md">
                      <h4 className="font-medium mb-2">{chave.replace(/_/g, ' ')}</h4>
                      {Array.isArray(dados) ? (
                        <div className="space-y-3">
                          {dados.map((item, idx) => (
                            <div key={idx} className="border-b border-gray-300 pb-2 last:border-b-0 last:pb-0">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {Object.entries(item).map(([subChave, subValor]) => (
                                  <div key={subChave}>
                                    <span className="text-gray-700 font-medium">{subChave.replace(/_/g, ' ')}:</span>{' '}
                                    <span>{typeof subValor === 'object' ? JSON.stringify(subValor) : subValor}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <span>{typeof dados === 'object' ? JSON.stringify(dados) : dados}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:justify-between gap-4 mt-6">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={voltarAoFormulario}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 mr-4"
                >
                  Voltar
                </button>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="forcarRegeneracao"
                    checked={forcarRegeneracao}
                    onChange={() => setForcarRegeneracao(!forcarRegeneracao)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="forcarRegeneracao" className="ml-2 block text-sm text-gray-700">
                    Forçar regeneração do contrato
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={previewLoading}
                className={`px-6 py-2 ${previewLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center`}
              >
                {previewLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando...
                  </>
                ) : (
                  'Gerar Contrato'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GerarContrato; 