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
import { 
  Badge, Button, Card, Label, Spinner, TextInput, Textarea, Checkbox, Toast, ToastToggle,
  Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell 
} from 'flowbite-react';
import { HiDownload, HiCheck, HiX } from 'react-icons/hi';

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
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Função auxiliar para extrair parâmetros de uma query SQL
  const extrairParametrosQuery = (query) => {
    if (!query) return [];

    const regex = /:\w+/g;
    const matches = query.match(regex) || [];

    // Remove os dois pontos do início de cada parâmetro
    return [...new Set(matches.map(param => param.substring(1)))];
  };

  const mostrarNotificacao = (message, type = 'success') => {
    setToast({ show: true, message, type });
    // Esconde automaticamente após 5 segundos
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
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
        mostrarNotificacao(`Erro ao buscar modelo: ${error.message}`, 'error');
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
        mostrarNotificacao(`Erro ao obter dados para o contrato: ${error.message}`, 'error');
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
      mostrarNotificacao(`Erro ao gerar contrato: ${error.message}`, 'error');
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
      mostrarNotificacao(`Erro ao obter histórico: ${error.message}`, 'error');
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
      const dados = await gerarContrato(modeloId, parametros, false);
      setContratoGerado(dados);

      const blob = await downloadContrato(contratoGerado.contrato.modeloId, contratoGerado.contrato.hash);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = contratoGerado.arquivo.nome;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      mostrarNotificacao('Contrato baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar o contrato:', error);
      mostrarNotificacao('Erro ao baixar o contrato', 'error');
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
      mostrarNotificacao('Modelo baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar o modelo:', error);
      mostrarNotificacao('Erro ao baixar o modelo', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div>
      {/* Toast/Notificação */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              {toast.type === 'success' ? (
                <HiCheck className="h-5 w-5 text-green-500" />
              ) : (
                <HiX className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="ml-3 text-sm font-normal">
              {toast.message}
            </div>
            <ToastToggle onClick={() => setToast({ ...toast, show: false })} />
          </Toast>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {preview
            ? (contratoGerado
              ? 'Contrato Gerado com Sucesso'
              : 'Pré-visualização dos Dados')
            : `Gerar Contrato: ${modelo?.titulo}`}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {preview
            ? (contratoGerado
              ? 'Seu contrato foi gerado e está pronto para download.'
              : 'Confira os dados que serão usados para gerar o contrato.')
            : 'Preencha os parâmetros necessários para as queries SQL.'}
        </p>
      </div>

      <Card>
        {modelo && (
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{modelo.titulo}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{modelo.descricao}</p>
              </div>
              <Button
                color="gray"
                onClick={handleDownloadModelo}
                className="flex items-center bg-gray-100 text-gray rounded-md hover:bg-gray-200"
              >
                <HiDownload className="mr-2 h-5 w-5" />
                Baixar Modelo
              </Button>
            </div>
          </div>
        )}

        {mostrarHistorico ? (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Histórico de Contratos
            </h3>

            {historicoLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="xl" />
              </div>
            ) : historicoContratos.length > 0 ? (
              <div className="overflow-x-auto">
                <Table hoverable>
                  <TableHead>
                    <TableRow>
                      <TableHeadCell>Versão</TableHeadCell>
                      <TableHeadCell>Data de Geração</TableHeadCell>
                      <TableHeadCell>Status</TableHeadCell>
                      <TableHeadCell>Arquivo</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historicoContratos.map((contrato) => (
                      <TableRow key={contrato.versao} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {contrato.versao}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {formatarData(contrato.dataGeracao)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge color={contrato.ativo ? 'success' : 'gray'}>
                            {contrato.ativo ? 'Ativo' : 'Substituído'}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Button
                            color="blue"
                            size="xs"
                            onClick={() => handleDownload()}
                            className="flex items-center"
                          >
                            <HiDownload className="mr-2 h-4 w-4" />
                            {contrato.arquivo.nome}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum contrato encontrado com os parâmetros informados.
                </p>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button
                color="gray"
                onClick={() => setMostrarHistorico(false)}
                className="bg-gray-100 text-gray rounded-md hover:bg-gray-200"
              >
                Voltar
              </Button>
            </div>
          </div>
        ) : !preview ? (
          // Formulário para preencher os parâmetros
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.keys(parametros).length > 0 ? (
                Object.keys(parametros).map((param) => (
                  <div key={param} className="mb-2">
                    <Label htmlFor={param}>
                      {param.replace(/_/g, ' ').toLowerCase()}*
                    </Label>
                    <TextInput
                      id={param}
                      type="text"
                      value={parametros[param] || ''}
                      onChange={(e) => handleChange(param, e.target.value)}
                      color={errors[param] ? 'failure' : 'gray'}
                      helperText={errors[param]}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Este modelo não possui parâmetros necessários.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">
              <div className="flex gap-2 items-center">
                <Button
                  color="gray"
                  onClick={() => navigate('/admin/contratos')}
                  className="bg-gray-100 text-gray rounded-md hover:bg-gray-200"
                >
                  Voltar
                </Button>

                <Button
                  color="gray"
                  onClick={buscarHistoricoContratos}
                  disabled={historicoLoading}
                  className="bg-gray-100 text-gray rounded-md hover:bg-gray-200"
                >
                  {historicoLoading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Carregando...
                    </>
                  ) : (
                    'Ver Histórico'
                  )}
                </Button>
              </div>

              <Button
                type="submit"
                color="blue"
                className="rounded-md"
              >
                Pré-visualizar Dados
              </Button>
            </div>
          </form>
        ) : contratoGerado ? (
          <div className="flex flex-col items-center">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 h-16 w-16 text-green-500">
                <HiCheck className="h-full w-full" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Contrato gerado com sucesso!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Seu contrato está pronto para download.
              </p>
            </div>

            <Card className="mb-6">
              <p className="text-sm mb-2">
                <span className="font-medium text-gray-900 dark:text-white">Nome do arquivo:</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">{contratoGerado.arquivo.nome}</span>
              </p>
            </Card>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                color="success"
                onClick={() => handleDownload()}
                className="flex items-center hover:underline cursor-pointer"
              >
                <HiDownload className="mr-2 h-5 w-5" />
                Baixar Contrato
              </Button>
              <Button
                color="blue"
                onClick={() => navigate('/admin/contratos')}
              >
                Concluir
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Dados do Contrato
              </h3>

              {dadosContrato && (
                <div className="space-y-6">
                  {dadosContrato.principal && dadosContrato.principal.length > 0 && (
                    <Card>
                      <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
                        Dados Principais
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(dadosContrato.principal[0]).map(([chave, valor]) => (
                          <div key={chave}>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{chave}:</span>{' '}
                            <span className="text-gray-600 dark:text-gray-400">
                              {typeof valor === 'object' ? JSON.stringify(valor) : valor}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {dadosContrato.variaveis && Object.entries(dadosContrato.variaveis).map(([chave, dados]) => (
                    <Card key={chave}>
                      <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
                        {chave.replace(/_/g, ' ')}
                      </h4>
                      {Array.isArray(dados) ? (
                        <div className="space-y-3">
                          {dados.map((item, idx) => (
                            <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-b-0 last:pb-0">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {Object.entries(item).map(([subChave, subValor]) => (
                                  <div key={subChave}>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                      {subChave.replace(/_/g, ' ')}:
                                    </span>{' '}
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {typeof subValor === 'object' ? JSON.stringify(subValor) : subValor}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            {typeof dados === 'object' ? JSON.stringify(dados) : dados}
                          </span>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:justify-between gap-4 mt-6">
              <div className="flex items-center">
                <Button
                  color="gray"
                  onClick={voltarAoFormulario}
                  className="mr-4 bg-gray-100 text-gray rounded-md hover:bg-gray-200"
                >
                  Voltar
                </Button>
                <div className="flex items-center">
                  <Checkbox
                    id="forcarRegeneracao"
                    checked={forcarRegeneracao}
                    onChange={() => setForcarRegeneracao(!forcarRegeneracao)}
                  />
                  <Label htmlFor="forcarRegeneracao" className="ml-2">
                    Forçar regeneração do contrato
                  </Label>
                </div>
              </div>
              <Button
                color="blue"
                onClick={handleSubmit}
                disabled={previewLoading}
              >
                {previewLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Gerando...
                  </>
                ) : (
                  'Gerar Contrato'
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default GerarContrato;