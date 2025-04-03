import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarContratosVigentes, obterModelo, downloadContrato } from '../../../services/contractService';
import { Badge, Button, Card, Label, Spinner, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, TextInput } from 'flowbite-react';
import { HiPlus, HiSearch, HiDownload, HiRefresh } from 'react-icons/hi';

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Contratos</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Visualize e baixe seus contratos gerados</p>
        </div>
        <Button as={Link} to="novo" color="blue" className="flex items-center">
          <HiPlus className="mr-2 h-5 w-5" />
          Gerar Novo Contrato
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="xl" />
        </div>
      ) : erro ? (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
          {erro}
        </div>
      ) : (
        <Card>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <TextInput
                type="text"
                placeholder="Buscar por identificador ou modelo..."
                className="pl-10"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
          </div>

          {filtrarContratos(contratos).length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Modelo</TableHeadCell>
                    <TableHeadCell>Identificadores</TableHeadCell>
                    <TableHeadCell>Parâmetros</TableHeadCell>
                    <TableHeadCell>Versão</TableHeadCell>
                    <TableHeadCell>Data de Geração</TableHeadCell>
                    <TableHeadCell className="text-right">Ações</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                  {filtrarContratos(contratos).map((contrato) => (
                    <TableRow key={contrato.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{contrato.modeloTitulo}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <span>ID: {contrato.modeloId}</span>
                          {contrato.modeloTipo && (
                            <Badge color="gray" className="ml-2">
                              {getTipoLabel(contrato.modeloTipo)}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col space-y-2 w-fit">
                          {contrato.identificadores && (
                            <>
                              <Badge color="blue" className="w-fit">
                                {contrato.identificadores.primario?.toUpperCase() || '-'}
                              </Badge>
                              <Badge color="warning" className="w-fit">
                                {contrato.identificadores.secundario || '-'}
                              </Badge>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {contrato.parametros ? (
                            Object.entries(contrato.parametros).map(([chave, valor]) => (
                              <div key={chave} className="mb-1">
                                <span className="font-medium">{chave}:</span>{' '}
                                <span className="text-gray-600 dark:text-gray-400">{valor || '-'}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 italic">Sem parâmetros definidos</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col space-y-2 h-fit w-fit m-auto">
                          <Badge color="blue">
                            v{contrato.versao}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {formatarData(contrato.dataGeracao)}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex justify-end space-x-3">
                          <Button size="xs" color="green" className="flex items-center" onClick={() => handleDownload(contrato)}>
                            <HiDownload className="mr-1 h-4 w-4" />
                            Baixar
                          </Button>
                          <Button as={Link} to={`gerar/${contrato.modeloId}`} size="xs" color="blue" className="flex items-center">
                            <HiRefresh className="mr-1 h-4 w-4" />
                            Regenerar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Nenhum contrato encontrado</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {termoBusca ? 'Tente ajustar seu filtro de busca.' : 'Você ainda não gerou nenhum contrato.'}
              </p>
              {!termoBusca && (
                <div className="mt-6">
                  <Button as={Link} to="/contratos/novo" color="blue" className="flex items-center">
                    <HiPlus className="mr-2 h-5 w-5" />
                    Gerar Primeiro Contrato
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export default ListarContratos; 