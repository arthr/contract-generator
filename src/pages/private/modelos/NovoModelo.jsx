import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Alert, Spinner, Modal, Toast, ToastToggle } from 'flowbite-react';
import { HiOutlineExclamation, HiCheck, HiX } from 'react-icons/hi';

// Componentes
import FormHeader from './components/FormHeader';
import BasicInfoForm from './components/BasicInfoForm';
import QueryForm from './components/QueryForm';
import VariableManager from './components/VariableManager';
import FileUploader from './components/FileUploader';

// Importe os serviços da API
import { uploadModeloTemplate, criarModelo } from '../../../services/contractService';

function NovoModelo() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'prestacao-servicos',
    descricao: '',
    arquivoTemplate: null,
    queryPrincipal: '',
    variaveis: []
  });

  const [errors, setErrors] = useState({});
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const tiposContrato = [
    { id: 'prestacao-servicos', label: 'Prestação de Serviços' },
    { id: 'compra-venda', label: 'Compra e Venda' },
    { id: 'locacao', label: 'Locação' },
    { id: 'parceria', label: 'Parceria' },
    { id: 'confidencialidade', label: 'Confidencialidade' }
  ];

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
        arquivoTemplate: 'Apenas arquivos .dotx ou .docx são aceitos'
      }));
      setNomeArquivo('');
      return;
    }

    setFormData(prev => ({
      ...prev,
      arquivoTemplate: file
    }));

    setNomeArquivo(file.name);

    if (errors.arquivoTemplate) {
      setErrors(prev => ({
        ...prev,
        arquivoTemplate: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.titulo.trim())
      newErrors.titulo = 'Título é obrigatório';

    if (!formData.descricao.trim())
      newErrors.descricao = 'Descrição é obrigatória';

    if (!formData.arquivoTemplate)
      newErrors.arquivoTemplate = 'Arquivo de template é obrigatório';

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
        setMensagemStatus('Preparando arquivo para upload...');

        // Sanitiza o nome do arquivo baseado no título do modelo
        const nomeArquivoSanitizado = sanitizarNomeArquivo(formData.titulo);

        // Obtém a extensão do arquivo original
        const extensaoArquivo = formData.arquivoTemplate.name.split('.').pop().toLowerCase();

        // Cria um novo objeto File com o nome sanitizado
        const novoArquivo = new File(
          [formData.arquivoTemplate],
          `${nomeArquivoSanitizado}.${extensaoArquivo}`,
          { type: formData.arquivoTemplate.type }
        );

        setMensagemStatus('Enviando arquivo para o servidor...');

        // Enviar o arquivo para o servidor usando a função da API
        const resultadoUpload = await uploadModeloTemplate(novoArquivo, `${nomeArquivoSanitizado}.${extensaoArquivo}`);

        setMensagemStatus('Enviando dados do modelo...');

        // Criar objeto com dados do modelo para enviar ao servidor
        const modeloData = {
          titulo: formData.titulo,
          tipo: formData.tipo,
          descricao: formData.descricao,
          caminhoTemplate: resultadoUpload.caminhoTemplate, // Usando o valor correto retornado pela API
          queryPrincipal: formData.queryPrincipal,
          variaveis: formData.variaveis
        };

        // Criar o modelo no banco de dados
        await criarModelo(modeloData);

        setMensagemStatus('Modelo criado com sucesso!');

        setTimeout(() => {
          mostrarNotificacao('Modelo de contrato criado com sucesso!');
          navigate('/modelos');
        }, 500);
      } catch (error) {
        console.error('Erro ao salvar modelo:', error);
        setMensagemStatus('Erro ao salvar o modelo.');
        mostrarNotificacao(`Erro ao salvar o modelo: ${error.message}`, 'error');
      } finally {
        setEnviando(false);
      }
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    navigate('/modelos');
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
        title="Novo Modelo de Contrato"
        description="Crie um modelo de contrato definindo seu conteúdo e as variáveis que poderão ser substituídas."
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
              error={errors.arquivoTemplate}
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
              {enviando ? 'Processando...' : 'Salvar Modelo'}
            </Button>
          </div>
        </form>
      </Card>

      <Modal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamation className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Tem certeza que deseja cancelar? Todas as alterações serão perdidas.
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmCancel}>
                Sim, cancelar
              </Button>
              <Button color="gray" onClick={() => setShowCancelModal(false)}>
                Voltar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default NovoModelo;