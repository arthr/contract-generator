import React, { useState } from 'react';

function VariableForm({ onAdd, variaveisExistentes = [] }) {
  // Estado para gerenciar a nova variável sendo adicionada
  const [novaVariavel, setNovaVariavel] = useState({
    nome: '',
    tipo: 'simples',
    subvariaveis: [],
    query: ''
  });
  
  // Estado para gerenciar a nova subvariável sendo adicionada
  const [novaSubvariavel, setNovaSubvariavel] = useState('');
  const [errors, setErrors] = useState({});
  
  const tiposVariavel = [
    { id: 'simples', label: 'Simples', descricao: 'Texto único que será substituído (Ex: {principal.cedente})' },
    { id: 'lista', label: 'Lista', descricao: 'Lista de itens com repetição (Ex: {#devedor} ... {nome}, {ender} ... {/devedor})' },
    { id: 'tabela', label: 'Tabela', descricao: 'Tabela de dados (Ex: {#titulos}{carteira}{valor}{vencimento}{status}{/})' }
  ];
  
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
  
  const formatarNomeVariavel = (nome) => {
    // Converte para formato de variável (minusculas e underscores)
    return nome.trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
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
    if (variaveisExistentes.some(v => v.nome === nomeFormatado)) {
      setErrors(prev => ({
        ...prev,
        nome: 'Já existe uma variável com este nome'
      }));
      return;
    }
    
    // Adiciona a variável ao estado do formulário
    const novaVariavelCompleta = {
      ...novaVariavel,
      nome: nomeFormatado,
    };
    
    onAdd(novaVariavelCompleta);
    
    // Limpa o formulário de nova variável
    setNovaVariavel({
      nome: '',
      tipo: 'simples',
      subvariaveis: [],
      query: ''
    });
    
    // Limpa os erros
    setErrors({});
  };
  
  return (
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
          placeholder="Ex: cedente"
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.nome ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.nome && (
          <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          O nome será convertido para minúsculas e com underscores. Ex: "Nome do Cliente" → "nome_do_cliente"
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
                ? "Ex: nome (ficará nome)" 
                : "Ex: valor (ficará valor)"}
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
              ? `Para um nome de lista "devedor", os campos serão acessados como {#devedor}{nome}, {endereco}, etc. {/devedor}`
              : `Para um nome de tabela "titulos", as colunas serão acessadas como cabeçalhos de coluna.`}
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
  );
}

export default VariableForm; 