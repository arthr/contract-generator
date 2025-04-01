import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Componentes
import FormHeader from './components/FormHeader';
import BasicInfoForm from './components/BasicInfoForm';
import QueryForm from './components/QueryForm';
import VariableManager from './components/VariableManager';
import FileUploader from './components/FileUploader';

// Importe os serviços da API
import { uploadModeloTemplate, criarModelo } from '../../../services/apiService';

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
          alert('Modelo de contrato criado com sucesso!');
          navigate('/admin/modelos');
        }, 500);
      } catch (error) {
        console.error('Erro ao salvar modelo:', error);
        setMensagemStatus('Erro ao salvar o modelo.');
        alert(`Erro ao salvar o modelo: ${error.message}`);
      } finally {
        setEnviando(false);
      }
    }
  };
  
  const handleCancel = () => {
    if (confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
      navigate('/admin/modelos');
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
  
  return (
    <div className="py-6">
      <FormHeader 
        title="Novo Modelo de Contrato" 
        description="Crie um modelo de contrato definindo seu conteúdo e as variáveis que poderão ser substituídas."
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
            {enviando ? 'Processando...' : 'Salvar Modelo'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NovoModelo; 