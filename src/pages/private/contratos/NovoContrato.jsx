import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarModelos } from '../../../services/contractService';
import { Badge, Button, Card, Label, Select, Spinner, TextInput } from 'flowbite-react';
import { HiDocument, HiSearch } from 'react-icons/hi';

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
        const modelosSimulados = [];

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
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gerar Novo Contrato</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Selecione um modelo para gerar seu contrato.</p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 -mt-2">
          <div className="flex-1">
            <div className="mb-2 block">
              <Label htmlFor="termoBusca">Buscar modelo</Label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
                <HiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <TextInput
                id="termoBusca"
                type="text"
                placeholder="Digite para buscar..."
                className="pl-10"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
          </div>
          <div className="md:w-64">
            <div className="mb-2 block">
              <Label htmlFor="filtroTipo">Filtrar por tipo</Label>
            </div>
            <Select
              id="filtroTipo"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              {tiposContrato.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="xl" />
        </div>
      ) : erro ? (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
          {erro}
        </div>
      ) : modelosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modelosFiltrados.map((modelo) => (
            <Card key={modelo._id} className="flex flex-col">
              <div className="flex flex-col justify-between items-start whitespace-nowrap">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{modelo.titulo}</h3>
                <div className="flex items-center gap-2">
                  <Badge color="blue">
                    {getTipoLabel(modelo.tipo)}
                  </Badge>
                  <Badge color="green">
                    v{modelo.versao || '1.0.1'}
                  </Badge>
                </div>
              </div>
              <hr className="w-full border-gray-200 dark:border-gray-600" />
              <div className="flex flex-col justify-between items-start gap-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{modelo.descricao || 'Sem descrição disponível.'}</p>
                <div className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p>Criado em: <Badge color="gray">{formatarData(modelo.createdAt)}</Badge></p>
                  <p>Última atualização: <Badge color="gray">{formatarData(modelo.updatedAt)}</Badge></p>
                </div>
              </div>
              <div>
                <Button as={Link} to={`/admin/contratos/gerar/${modelo._id}`} color="blue" className="w-full flex items-center justify-center">
                  <HiDocument className="mr-2 h-5 w-5" />
                  Usar este modelo
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <HiDocument className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {termoBusca || filtroTipo !== 'todos'
              ? 'Nenhum modelo encontrado com os filtros selecionados.'
              : 'Não existem modelos de contrato disponíveis.'}
          </p>
          {termoBusca || filtroTipo !== 'todos' ? (
            <Button
              color="gray"
              onClick={() => {
                setTermoBusca('');
                setFiltroTipo('todos');
              }}
            >
              Limpar filtros
            </Button>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Entre em contato com um administrador para solicitar novos modelos.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default NovoContrato; 