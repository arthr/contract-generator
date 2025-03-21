import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obterModelo, atualizarModelo, uploadModeloTemplate } from '../../services/apiService';

// Componentes
import FormHeader from './components/FormHeader';
import BasicInfoForm from './components/BasicInfoForm';
import QueryForm from './components/QueryForm';
import VariableManager from './components/VariableManager';
import FileUploader from './components/FileUploader';

function EditarModelo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    descricao: '',
    queryPrincipal: '',
    variaveis: [],
    arquivoTemplate: null
  });
  
  const [modeloOriginal, setModeloOriginal] = useState(null);
  const [errors, setErrors] = useState({});
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  
  const tiposContrato = [
    { id: 'prestacao-servicos', label: 'Prestação de Serviços' },
    { id: 'compra-venda', label: 'Compra e Venda' },
    { id: 'locacao', label: 'Locação' },
    { id: 'parceria', label: 'Parceria' },
    { id: 'confidencialidade', label: 'Confidencialidade' }
  ];
  
  useEffect(() => {
    carregarModelo();
  }, [id]);
  
  const carregarModelo = async () => {
    setCarregando(true);
    try {
      const data = await obterModelo(id);
      
      setModeloOriginal(data);
      setFormData({
        titulo: data.titulo,
        tipo: data.tipo,
        descricao: data.descricao,
        queryPrincipal: data.queryPrincipal,
        variaveis: data.variaveis,
        arquivoTemplate: null
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
        arquivoTemplate: 'Apenas arquivos .dotx ou .docx são aceitos'
      }));
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      try {
        setEnviando(true);
        
        let caminhoTemplate = modeloOriginal.caminhoTemplate;
        
        // Se um novo arquivo foi selecionado, envie-o primeiro
        if (formData.arquivoTemplate) {
          setMensagemStatus('Preparando arquivo para upload...');
          
          const nomeArquivoSanitizado = sanitizarNomeArquivo(formData.titulo);
          const extensaoArquivo = formData.arquivoTemplate.name.split('.').pop().toLowerCase();
          
          const novoArquivo = new File(
            [formData.arquivoTemplate], 
            `${nomeArquivoSanitizado}.${extensaoArquivo}`,
            { type: formData.arquivoTemplate.type }
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
        
        await atualizarModelo(id, modeloData);
        
        setMensagemStatus('Modelo atualizado com sucesso!');
        
        setTimeout(() => {
          alert('Modelo de contrato atualizado com sucesso!');
          navigate(`/modelos/${id}`);
        }, 500);
      } catch (error) {
        console.error('Erro ao atualizar modelo:', error);
        setMensagemStatus('Erro ao atualizar o modelo.');
        alert(`Erro ao atualizar o modelo: ${error.message}`);
      } finally {
        setEnviando(false);
      }
    }
  };
  
  const handleCancel = () => {
    if (confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
      navigate(`/modelos/${id}`);
    }
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (erro) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4" role="alert">
        <p className="font-bold">Erro</p>
        <p>{erro}</p>
        <button 
          onClick={carregarModelo}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
        >
          Tentar novamente
        </button>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <FormHeader 
        title="Editar Modelo de Contrato" 
        description="Atualize as informações do modelo de contrato."
      />
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        {enviando && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <div className="flex items-center justify-center mb-4">
                <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
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
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={enviando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-md transition-colors ${
              enviando 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={enviando}
          >
            {enviando ? 'Processando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarModelo; 