import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listarModelos, excluirModelo } from '../../../services/contractService';
import { Button, Card, TextInput, Badge, Spinner, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Toast, ToastToggle } from 'flowbite-react';
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import { HiPlus, HiSearch, HiEye, HiPencil, HiTrash, HiDocumentText, HiCheck, HiX, HiOutlineExclamation } from 'react-icons/hi';

function ListarModelos() {
  const [modelos, setModelos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modeloParaExcluir, setModeloParaExcluir] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const tiposContrato = {
    'prestacao-servicos': 'Prestação de Serviços',
    'compra-venda': 'Compra e Venda',
    'locacao': 'Locação',
    'parceria': 'Parceria',
    'confidencialidade': 'Confidencialidade'
  };

  useEffect(() => {
    carregarModelos();
  }, []);

  const carregarModelos = async () => {
    setCarregando(true);
    try {
      const data = await listarModelos();
      setModelos(data);
      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
      setErro('Não foi possível carregar os modelos. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const mostrarNotificacao = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
  };

  const handleExcluir = (id, titulo) => {
    setModeloParaExcluir({ id, titulo });
    setShowDeleteModal(true);
  };

  const confirmarExclusao = async () => {
    if (modeloParaExcluir) {
      try {
        await excluirModelo(modeloParaExcluir.id);
        setModelos(modelos.filter(modelo => modelo._id !== modeloParaExcluir.id));
        mostrarNotificacao('Modelo excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir modelo:', error);
        mostrarNotificacao('Erro ao excluir o modelo. Por favor, tente novamente.', 'error');
      } finally {
        setShowDeleteModal(false);
        setModeloParaExcluir(null);
      }
    }
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value.toLowerCase());
  };

  const modelosFiltrados = modelos.filter(modelo => 
    modelo.titulo.toLowerCase().includes(filtro) || 
    modelo.descricao.toLowerCase().includes(filtro) ||
    tiposContrato[modelo.tipo]?.toLowerCase().includes(filtro)
  );

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  if (erro) {
    return (
      <Alert color="failure" className="my-4">
        <h3 className="font-bold">Erro</h3>
        <p>{erro}</p>
        <div className="mt-2">
          <Button color="failure" onClick={carregarModelos}>
            Tentar novamente
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div>
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

      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        size="md"
      >
        <ModalHeader>
          Confirmar Exclusão
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamation className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Tem certeza que deseja excluir o modelo "{modeloParaExcluir?.titulo}"? Esta ação não pode ser desfeita.
            </h3>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-center gap-4 w-full">
            <Button color="failure" onClick={confirmarExclusao}>
              Sim, excluir
            </Button>
            <Button color="gray" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Modelos de Contrato</h1>
          <p>Gerencie seus modelos de contratos personalizados</p>
        </div>
        <Button as={Link} to="novo" color="blue">
          <HiPlus className="mr-2 h-5 w-5" />
          Novo Modelo
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <TextInput
            icon={HiSearch}
            placeholder="Buscar modelos..."
            value={filtro}
            onChange={handleFiltroChange}
          />
        </div>

        {modelosFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <HiDocumentText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum modelo encontrado</h3>
            <p className="mt-1 text-gray-500">
              {filtro ? 'Tente ajustar seu filtro de busca.' : 'Comece criando seu primeiro modelo de contrato.'}
            </p>
            {!filtro && (
              <div className="mt-6">
                <Button as={Link} to="novo" color="blue">
                  <HiPlus className="mr-2 h-5 w-5" />
                  Criar Modelo
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Título</TableHeadCell>
                  <TableHeadCell>Tipo</TableHeadCell>
                  <TableHeadCell>Variáveis</TableHeadCell>
                  <TableHeadCell>Criado em</TableHeadCell>
                  <TableHeadCell>
                    <span className="sr-only">Ações</span>
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {modelosFiltrados.map((modelo) => (
                  <TableRow key={modelo._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium">{modelo.titulo}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{modelo.descricao}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge color="info">{tiposContrato[modelo.tipo] || modelo.tipo}</Badge>
                    </TableCell>
                    <TableCell>{modelo.variaveis.length} variáveis</TableCell>
                    <TableCell>{formatarData(modelo.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <Button color="info" size="xs" pill onClick={() => navigate(`${modelo._id}`)}>
                          <HiEye className="h-4 w-4" />
                        </Button>
                        <Button color="blue" size="xs" pill onClick={() => navigate(`editar/${modelo._id}`)}>
                          <HiPencil className="h-4 w-4" />
                        </Button>
                        <Button color="failure" size="xs" pill onClick={() => handleExcluir(modelo._id, modelo.titulo)}>
                          <HiTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default ListarModelos;