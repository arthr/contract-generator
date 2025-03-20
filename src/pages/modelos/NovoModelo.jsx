import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
  
  // Estado para gerenciar a nova variável sendo adicionada
  const [novaVariavel, setNovaVariavel] = useState({
    nome: '',
    tipo: 'simples',
    subvariaveis: [],
    query: '' // Query específica para listas e tabelas
  });
  
  // Estado para gerenciar a nova subvariável sendo adicionada
  const [novaSubvariavel, setNovaSubvariavel] = useState('');
  
  const [errors, setErrors] = useState({});
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [variaveisFiltradas, setVariaveisFiltradas] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  
  const tiposContrato = [
    { id: 'prestacao-servicos', label: 'Prestação de Serviços' },
    { id: 'compra-venda', label: 'Compra e Venda' },
    { id: 'locacao', label: 'Locação' },
    { id: 'parceria', label: 'Parceria' },
    { id: 'confidencialidade', label: 'Confidencialidade' }
  ];
  
  const tiposVariavel = [
    { id: 'simples', label: 'Simples', descricao: 'Texto único que será substituído (Ex: {{CEDENTE}})' },
    { id: 'lista', label: 'Lista', descricao: 'Lista de itens com repetição (Ex: {{L:DEVEDOR}} ... conteúdo ... {{L:DEVEDOR}})' },
    { id: 'tabela', label: 'Tabela', descricao: 'Tabela de dados (Ex: {{T:TITULOS}})' }
  ];
  
  // Atualiza o filtro e aplica-o às variáveis
  const atualizarFiltro = (tipo) => {
    setFiltroTipo(tipo);
    
    if (tipo === 'todos') {
      setVariaveisFiltradas(formData.variaveis);
    } else {
      setVariaveisFiltradas(formData.variaveis.filter(v => v.tipo === tipo));
    }
  };
  
  // Atualiza as variáveis filtradas quando a lista de variáveis mudar
  React.useEffect(() => {
    atualizarFiltro(filtroTipo);
  }, [formData.variaveis]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleNovaVariavelChange = (e) => {
    const { name, value } = e.target;
    setNovaVariavel(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa subvariáveis e query ao mudar o tipo para simples
    if (name === 'tipo' && value === 'simples') {
      setNovaVariavel(prev => ({
        ...prev,
        subvariaveis: [],
        query: ''
      }));
    }
    
    if (errors.variaveis) {
      setErrors(prev => ({
        ...prev,
        variaveis: null
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Verificar a extensão do arquivo
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

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  
  const formatarNomeVariavel = (nome) => {
    // Converte para formato de variável (maiúsculas e underscores)
    return nome.trim()
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '');
  };
  
  const adicionarSubvariavel = () => {
    if (novaSubvariavel.trim() === '') return;
    
    // Formata e adiciona a subvariável
    const formatada = formatarNomeVariavel(novaSubvariavel);
    
    if (novaVariavel.subvariaveis.includes(formatada)) {
      setErrors(prev => ({
        ...prev,
        subvariaveis: 'Esta subvariável já existe'
      }));
      return;
    }
    
    setNovaVariavel(prev => ({
      ...prev,
      subvariaveis: [...prev.subvariaveis, formatada]
    }));
    
    setNovaSubvariavel('');
    
    if (errors.subvariaveis) {
      setErrors(prev => ({
        ...prev,
        subvariaveis: null
      }));
    }
  };
  
  const removerSubvariavel = (index) => {
    setNovaVariavel(prev => ({
      ...prev,
      subvariaveis: prev.subvariaveis.filter((_, i) => i !== index)
    }));
  };
  
  const addVariavel = () => {
    if (novaVariavel.nome.trim() === '') return;
    
    // Validações específicas por tipo
    if ((novaVariavel.tipo === 'lista' || novaVariavel.tipo === 'tabela') && 
        novaVariavel.subvariaveis.length === 0) {
      setErrors(prev => ({
        ...prev,
        subvariaveis: `Adicione pelo menos uma subvariável para a ${novaVariavel.tipo === 'lista' ? 'lista' : 'tabela'}`
      }));
      return;
    }
    
    // Validar query para lista/tabela
    if ((novaVariavel.tipo === 'lista' || novaVariavel.tipo === 'tabela') && 
        !novaVariavel.query.trim()) {
      setErrors(prev => ({
        ...prev,
        query: `Defina uma query SQL para a ${novaVariavel.tipo === 'lista' ? 'lista' : 'tabela'}`
      }));
      return;
    }
    
    // Formata o nome da variável
    const nomeFormatado = formatarNomeVariavel(novaVariavel.nome);
    
    // Verifica se já existe uma variável com o mesmo nome
    if (formData.variaveis.some(v => v.nome === nomeFormatado)) {
      setErrors(prev => ({
        ...prev,
        variaveis: 'Já existe uma variável com este nome'
      }));
      return;
    }
    
    // Adiciona a variável ao estado do formulário
    const novaVariavelCompleta = {
      ...novaVariavel,
      nome: nomeFormatado,
    };
    
    setFormData(prev => ({
      ...prev,
      variaveis: [...prev.variaveis, novaVariavelCompleta]
    }));
    
    // Limpa o formulário de nova variável
    setNovaVariavel({
      nome: '',
      tipo: 'simples',
      subvariaveis: [],
      query: ''
    });
    
    if (errors.variaveis) {
      setErrors(prev => ({
        ...prev,
        variaveis: null
      }));
    }
    
    if (errors.query) {
      setErrors(prev => ({
        ...prev,
        query: null
      }));
    }
  };
  
  const removeVariavel = (index) => {
    setFormData(prev => ({
      ...prev,
      variaveis: prev.variaveis.filter((_, i) => i !== index)
    }));
  };
  
  const obterFormatoExibicao = (variavel) => {
    if (variavel.tipo === 'simples') {
      return `{{${variavel.nome}}}`;
    } else if (variavel.tipo === 'lista') {
      return `{{L:${variavel.nome}}}`;
    } else if (variavel.tipo === 'tabela') {
      return `{{T:${variavel.nome}}}`;
    }
    return '';
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Aqui faríamos a integração com uma API para salvar o modelo
      console.log('Formulário válido, dados:', formData);
      
      // Simula um sucesso e redireciona
      alert('Modelo de contrato criado com sucesso!');
      navigate('/modelos'); // Redireciona para a lista de modelos
    }
  };
  
  const handleCancel = () => {
    if (confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
      navigate('/modelos');
    }
  };
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Novo Modelo de Contrato</h2>
        <p className="text-gray-600 mt-2">
          Crie um modelo de contrato definindo seu conteúdo e as variáveis que poderão ser substituídas.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título do Modelo */}
          <div className="md:col-span-2">
            <label htmlFor="titulo" className="block text-gray-700 font-medium mb-2">
              Título do Modelo*
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.titulo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Contrato de Prestação de Serviços"
            />
            {errors.titulo && (
              <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>
            )}
          </div>
          
          {/* Tipo de Contrato */}
          <div>
            <label htmlFor="tipo" className="block text-gray-700 font-medium mb-2">
              Tipo de Contrato*
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tiposContrato.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Descrição */}
          <div>
            <label htmlFor="descricao" className="block text-gray-700 font-medium mb-2">
              Descrição*
            </label>
            <input
              type="text"
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.descricao ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Modelo para serviços de consultoria"
            />
            {errors.descricao && (
              <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>
            )}
          </div>
          
          {/* Query Principal */}
          <div className="md:col-span-2">
            <label htmlFor="queryPrincipal" className="block text-gray-700 font-medium mb-2">
              Query Principal*
            </label>
            <div className="relative">
              <textarea
                id="queryPrincipal"
                name="queryPrincipal"
                value={formData.queryPrincipal}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-2 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.queryPrincipal ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="SELECT * FROM contratos WHERE id = :id_contrato"
              ></textarea>
            </div>
            {errors.queryPrincipal && (
              <p className="text-red-500 text-sm mt-1">{errors.queryPrincipal}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Esta query deve retornar uma única linha, fornecendo dados para todas as variáveis simples.
              Use parâmetros com prefixo ":" (ex: :id_contrato) que serão substituídos durante a geração.
            </p>
          </div>
          
          {/* Variáveis */}
          <div className="md:col-span-2">
            <div className="border border-gray-300 rounded-md p-4 mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Adicionar Nova Variável</h3>
              
              {/* Nome da Variável */}
              <div className="mb-3">
                <label htmlFor="nome-variavel" className="block text-gray-700 mb-1">
                  Nome da Variável*
                </label>
                <input
                  type="text"
                  id="nome-variavel"
                  name="nome"
                  value={novaVariavel.nome}
                  onChange={handleNovaVariavelChange}
                  placeholder="Ex: CEDENTE"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  O nome será convertido para maiúsculas e com underscores. Ex: "Nome do Cliente" → "NOME_DO_CLIENTE"
                </p>
              </div>
              
              {/* Tipo de Variável */}
              <div className="mb-3">
                <label className="block text-gray-700 mb-1">
                  Tipo de Variável*
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {tiposVariavel.map(tipo => (
                    <div 
                      key={tipo.id} 
                      className={`border p-3 rounded-md cursor-pointer ${
                        novaVariavel.tipo === tipo.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => handleNovaVariavelChange({ target: { name: 'tipo', value: tipo.id } })}
                    >
                      <div className="flex items-center mb-1">
                        <input 
                          type="radio" 
                          checked={novaVariavel.tipo === tipo.id}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        <span className="font-medium">{tipo.label}</span>
                      </div>
                      <p className="text-xs text-gray-600">{tipo.descricao}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Configurações específicas para tipo de variável */}
              {(novaVariavel.tipo === 'lista' || novaVariavel.tipo === 'tabela') && (
                <div className="mb-3 border-t border-gray-200 pt-3 mt-3">
                  {/* Query específica para listas e tabelas */}
                  <div className="mb-3">
                    <label htmlFor="query-variavel" className="block text-gray-700 mb-1">
                      {novaVariavel.tipo === 'lista' ? 'Query da Lista*' : 'Query da Tabela*'}
                    </label>
                    <textarea
                      id="query-variavel"
                      name="query"
                      value={novaVariavel.query}
                      onChange={handleNovaVariavelChange}
                      rows="3"
                      className={`w-full px-4 py-2 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.query ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={novaVariavel.tipo === 'lista' 
                        ? "SELECT * FROM devedores WHERE contrato_id = :id_contrato" 
                        : "SELECT * FROM titulos WHERE contrato_id = :id_contrato"}
                    ></textarea>
                    {errors.query && (
                      <p className="text-red-500 text-sm mt-1">{errors.query}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Esta query {novaVariavel.tipo === 'lista' ? 'pode retornar múltiplas linhas, uma para cada item da lista' : 'retornará dados para criar uma tabela'}.
                      Use os mesmos parâmetros da query principal para manter a consistência.
                    </p>
                  </div>
                
                  {/* Campos/Colunas para lista ou tabela */}
                  <label className="block text-gray-700 mb-1">
                    {novaVariavel.tipo === 'lista' ? 'Campos da Lista*' : 'Colunas da Tabela*'}
                  </label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={novaSubvariavel}
                      onChange={(e) => setNovaSubvariavel(e.target.value)}
                      placeholder={novaVariavel.tipo === 'lista' 
                        ? "Ex: NOME (ficará LISTA.NOME)" 
                        : "Ex: VALOR (ficará TABELA.VALOR)"}
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={adicionarSubvariavel}
                      className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200 transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                  
                  {errors.subvariaveis && (
                    <p className="text-red-500 text-sm mb-2">{errors.subvariaveis}</p>
                  )}
                  
                  {novaVariavel.subvariaveis.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium mb-1">
                        {novaVariavel.tipo === 'lista' ? 'Campos adicionados:' : 'Colunas adicionadas:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {novaVariavel.subvariaveis.map((subvar, index) => (
                          <div key={index} className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-blue-600 font-medium mr-2">
                              {subvar}
                            </span>
                            <button
                              type="button"
                              onClick={() => removerSubvariavel(index)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {novaVariavel.tipo === 'lista' 
                      ? `Para um nome de lista "DEVEDOR", os campos serão acessados como {{DEVEDOR.NOME}}, {{DEVEDOR.ENDERECO}}, etc.`
                      : `Para um nome de tabela "TITULOS", as colunas serão acessadas como cabeçalhos de coluna.`}
                  </p>
                </div>
              )}
              
              {/* Botão adicionar variável */}
              <button
                type="button"
                onClick={addVariavel}
                disabled={!novaVariavel.nome.trim() || (
                  (novaVariavel.tipo === 'lista' || novaVariavel.tipo === 'tabela') && 
                  (novaVariavel.subvariaveis.length === 0 || !novaVariavel.query.trim())
                )}
                className={`px-4 py-2 rounded-md ${
                  !novaVariavel.nome.trim() || (
                    (novaVariavel.tipo === 'lista' || novaVariavel.tipo === 'tabela') && 
                    (novaVariavel.subvariaveis.length === 0 || !novaVariavel.query.trim())
                  )
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-colors w-full mt-2`}
              >
                Adicionar Variável
              </button>
            </div>
            
            {/* Lista de variáveis adicionadas */}
            <label className="block text-gray-700 font-medium mb-2">
              Variáveis do Modelo*
            </label>
            
            {errors.variaveis && (
              <p className="text-red-500 text-sm mb-2">{errors.variaveis}</p>
            )}
            
            {/* Filtro de variáveis */}
            {formData.variaveis.length > 0 && (
              <div className="flex space-x-2 mb-3">
                <button
                  type="button"
                  onClick={() => atualizarFiltro('todos')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filtroTipo === 'todos' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => atualizarFiltro('simples')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filtroTipo === 'simples' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Simples
                </button>
                <button
                  type="button"
                  onClick={() => atualizarFiltro('lista')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filtroTipo === 'lista' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Listas
                </button>
                <button
                  type="button"
                  onClick={() => atualizarFiltro('tabela')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filtroTipo === 'tabela' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Tabelas
                </button>
              </div>
            )}
            
            {formData.variaveis.length > 0 ? (
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-medium">Nome</th>
                      <th className="px-4 py-2 font-medium">Tipo</th>
                      <th className="px-4 py-2 font-medium">Formato no Documento</th>
                      <th className="px-4 py-2 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {variaveisFiltradas.map((variavel, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="font-medium">{variavel.nome}</span>
                          
                          {/* Mostra subvariáveis se existirem */}
                          {(variavel.tipo === 'lista' || variavel.tipo === 'tabela') && variavel.subvariaveis.length > 0 && (
                            <div className="mt-1">
                              <span className="text-xs text-gray-500 block mb-1">
                                {variavel.tipo === 'lista' ? 'Campos:' : 'Colunas:'}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {variavel.subvariaveis.map((subvar, idx) => (
                                  <span key={idx} className="inline-block bg-gray-100 px-2 py-1 rounded text-xs">
                                    {variavel.tipo === 'lista' ? `${variavel.nome}.${subvar}` : subvar}
                                  </span>
                                ))}
                              </div>
                              
                              {/* Exibe a query associada */}
                              {variavel.query && (
                                <div className="mt-2">
                                  <span className="text-xs text-gray-500 block mb-1">Query:</span>
                                  <div className="bg-gray-50 p-2 rounded text-xs font-mono border border-gray-200 max-h-20 overflow-y-auto">
                                    {variavel.query}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            variavel.tipo === 'simples' ? 'bg-green-100 text-green-800' :
                            variavel.tipo === 'lista' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {variavel.tipo === 'simples' ? 'Simples' :
                             variavel.tipo === 'lista' ? 'Lista' : 'Tabela'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {obterFormatoExibicao(variavel)}
                          
                          {variavel.tipo === 'lista' && (
                            <div className="mt-1">
                              <div className="text-gray-500">
                                <p>Para obter campos da lista:</p>
                                {variavel.subvariaveis.map((subvar, idx) => (
                                  <div key={idx}>{'{{' + variavel.nome + '.' + subvar + '}}'}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeVariavel(formData.variaveis.findIndex(v => v.nome === variavel.nome))}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 border border-gray-300 rounded-md bg-gray-50">
                <p className="text-gray-500">Nenhuma variável adicionada ainda.</p>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-2">
              Adicione todas as variáveis que serão usadas no seu template do Word conforme o formato acima.
            </p>
          </div>
          
          {/* Arquivo Template */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Arquivo de Template do Word (.dotx)*
            </label>
            <div className={`border ${errors.arquivoTemplate ? 'border-red-500' : 'border-gray-300'} rounded-md p-4 flex items-center`}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".dotx,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div className="flex-grow">
                {nomeArquivo ? (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-800">{nomeArquivo}</span>
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum arquivo selecionado</p>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleBrowseClick}
                className="ml-4 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                {nomeArquivo ? 'Alterar arquivo' : 'Escolher arquivo'}
              </button>
            </div>
            
            {errors.arquivoTemplate && (
              <p className="text-red-500 text-sm mt-1">{errors.arquivoTemplate}</p>
            )}
            
            <p className="text-sm text-gray-500 mt-2">
              Envie um arquivo de template do Word (.dotx) contendo seu modelo de contrato com as variáveis marcadas conforme os formatos mostrados na tabela acima.
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Salvar Modelo
          </button>
        </div>
      </form>
    </div>
  );
}

export default NovoModelo; 