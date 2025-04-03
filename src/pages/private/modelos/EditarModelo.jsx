import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obterModelo, atualizarModelo, uploadModeloTemplate } from '../../../services/contractService';
import { Button, Card, Alert, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Toast, ToastToggle } from 'flowbite-react';
import { HiOutlineExclamation, HiCheck, HiX } from 'react-icons/hi';

// Componentes
import FormHeader from './components/FormHeader';
import BasicInfoForm from './components/BasicInfoForm';
import QueryForm from './components/QueryForm';
import VariableManager from './components/VariableManager';
import FileUploader from './components/FileUploader';

function EditarModelo() {
  const { modeloId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    descricao: '',
    queryPrincipal: '',
    variaveis: [],
    caminhoTemplate: null
  });

  const [modeloOriginal, setModeloOriginal] = useState(null);
  const [errors, setErrors] = useState({});
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const tiposContrato = [
    { id: 'prestacao-servicos', label: 'Prestação de Serviços' },
    { id: 'compra-venda', label: 'Compra e Venda' },
    { id: 'locacao', label: 'Locação' },
    { id: 'parceria', label: 'Parceria' },
    { id: 'confidencialidade', label: 'Confidencialidade' }
  ];

  useEffect(() => {
    carregarModelo();
  }, [modeloId]);

  const carregarModelo = async () => {
    setCarregando(true);
    try {
      const data = await obterModelo(modeloId);

      setModeloOriginal(data);
      setFormData({
        titulo: data.titulo,
        tipo: data.tipo,
        descricao: data.descricao,
        queryPrincipal: data.queryPrincipal,
        variaveis: data.variaveis,
        caminhoTemplate: null
      });

      // Extrair apenas o nome do arquivo do caminho
      const nomeArquivoCompleto = data.caminhoTemplate.split('\\').pop();
      setNomeArquivo(nomeArquivoCompleto);

      setErro(null);
    } catch (error) {
      console.error('Erro ao carregar modelo:', error);
      setErro('Não foi possível carregar os detalhes do modelo. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const fileExt = file.name.split('.').pop().toLowerCase();
    if (fileExt !== 'dotx' && fileExt !== 'docx') {
      setErrors(prev => ({
        ...prev,
        caminhoTemplate: 'Apenas arquivos .dotx ou .docx são aceitos'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      caminhoTemplate: file
    }));

    setNomeArquivo(file.name);

    if (errors.caminhoTemplate) {
      setErrors(prev => ({
        ...prev,
        caminhoTemplate: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.titulo.trim())
      newErrors.titulo = 'Título é obrigatório';

    if (!formData.descricao.trim())
      newErrors.descricao = 'Descrição é obrigatória';

    if (!formData.queryPrincipal.trim())
      newErrors.queryPrincipal = 'Query principal é obrigatória';

    if (formData.variaveis.length === 0)
      newErrors.variaveis = 'Adicione pelo menos uma variável ao modelo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sanitizarNomeArquivo = (nome) => {
    // Remove acentos
    const semAcentos = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Substitui espaços por hífens e remove caracteres especiais
    return semAcentos
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '')
      .replace(/-+/g, '-'); // Evita hífens duplicados
  };

  const mostrarNotificacao = (message, type = 'success') => {
    setToast({ show: true, message, type });
    // Esconde automaticamente após 5 segundos
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        setEnviando(true);

        let caminhoTemplate = modeloOriginal.caminhoTemplate;

        // Se um novo arquivo foi selecionado, envie-o primeiro
        if (formData.caminhoTemplate) {
          setMensagemStatus('Preparando arquivo para upload...');

          const nomeArquivoSanitizado = sanitizarNomeArquivo(formData.titulo);
          const extensaoArquivo = formData.caminhoTemplate.name.split('.').pop().toLowerCase();

          const novoArquivo = new File(
            [formData.caminhoTemplate],
            `${nomeArquivoSanitizado}.${extensaoArquivo}`,
            { type: formData.caminhoTemplate.type }
          );

          setMensagemStatus('Enviando arquivo para o servidor...');

          const resultadoUpload = await uploadModeloTemplate(novoArquivo, `${nomeArquivoSanitizado}.${extensaoArquivo}`);
          caminhoTemplate = resultadoUpload.caminhoTemplate;
        }

        setMensagemStatus('Atualizando dados do modelo...');

        const modeloData = {
          titulo: formData.titulo,
          tipo: formData.tipo,
          descricao: formData.descricao,
          caminhoTemplate: caminhoTemplate,
          queryPrincipal: formData.queryPrincipal,
          variaveis: formData.variaveis
        };

        await atualizarModelo(modeloId, modeloData);

        setMensagemStatus('Modelo atualizado com sucesso!');

        setTimeout(() => {
          mostrarNotificacao('Modelo de contrato atualizado com sucesso!');
          navigate(`/admin/modelos/${modeloId}`);
        }, 500);
      } catch (error) {
        console.error('Erro ao atualizar modelo:', error);
        setMensagemStatus('Erro ao atualizar o modelo.');
        mostrarNotificacao(`Erro ao atualizar o modelo: ${error.message}`, 'error');
      } finally {
        setEnviando(false);
      }
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    navigate(`/admin/modelos/${modeloId}`);
  };

  const addVariavel = (novaVariavel) => {
    setFormData(prev => ({
      ...prev,
      variaveis: [...prev.variaveis, novaVariavel]
    }));

    if (errors.variaveis) {
      setErrors(prev => ({
        ...prev,
        variaveis: null
      }));
    }
  };

  const removeVariavel = (index) => {
    setFormData(prev => ({
      ...prev,
      variaveis: prev.variaveis.filter((_, i) => i !== index)
    }));
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
          <Button color="failure" onClick={carregarModelo}>
            Tentar novamente
          </Button>
        </div>
      </Alert>
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

      <FormHeader
        title="Editar Modelo de Contrato"
        description="Atualize as informações do modelo de contrato."
      />

      <Card>
        <form onSubmit={handleSubmit}>
          {enviando && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex items-center justify-center mb-4">
                  <Spinner size="xl" className="mr-3" />
                  <span className="text-lg font-medium">{mensagemStatus}</span>
                </div>
                <p className="text-center text-gray-600">
                  Não feche ou atualize a página durante o processo.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BasicInfoForm
              formData={formData}
              errors={errors}
              tiposContrato={tiposContrato}
              onChange={handleChange}
            />

            <QueryForm
              query={formData.queryPrincipal}
              error={errors.queryPrincipal}
              onChange={handleChange}
            />

            <VariableManager
              variaveis={formData.variaveis}
              error={errors.variaveis}
              onAdd={addVariavel}
              onRemove={removeVariavel}
            />
          
            <FileUploader
              fileInputRef={fileInputRef}
              nomeArquivo={nomeArquivo}
              error={errors.caminhoTemplate}
              onChange={handleFileChange}
            />
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Button
              color="light"
              onClick={handleCancel}
              disabled={enviando}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              color="blue"
              disabled={enviando}
            >
              {enviando ? 'Processando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Card>
      
      <Modal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        size="md"
      >
        <ModalHeader>
          Confirmação
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamation className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Tem certeza que deseja cancelar? Todas as alterações serão perdidas.
            </h3>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-center gap-4 w-full">
            <Button color="failure" onClick={confirmCancel}>
              Sim, cancelar
            </Button>
            <Button color="gray" onClick={() => setShowCancelModal(false)}>
              Voltar
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default EditarModelo;