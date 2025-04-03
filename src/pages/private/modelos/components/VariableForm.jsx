import React, { useState } from 'react';
import { TextInput, Button, Label, Card, Textarea, Radio, HelperText } from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';

function VariableForm({ onAdd, variaveisExistentes = [] }) {
  const [novaVariavel, setNovaVariavel] = useState({
    nome: '',
    tipo: 'simples',
    subvariaveis: [],
    query: ''
  });
  
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
    return nome.trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  };
  
  const adicionarSubvariavel = () => {
    if (novaSubvariavel.trim() === '') return;
    
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
    
    if ((novaVariavel.tipo === 'lista' || novaVariavel.tipo === 'tabela') && 
        novaVariavel.subvariaveis.length === 0) {
      setErrors(prev => ({
        ...prev,
        subvariaveis: `Adicione pelo menos uma subvariável para a ${novaVariavel.tipo === 'lista' ? 'lista' : 'tabela'}`
      }));
      return;
    }
    
    if ((novaVariavel.tipo === 'lista' || novaVariavel.tipo === 'tabela') && 
        !novaVariavel.query.trim()) {
      setErrors(prev => ({
        ...prev,
        query: `Defina uma query SQL para a ${novaVariavel.tipo === 'lista' ? 'lista' : 'tabela'}`
      }));
      return;
    }
    
    const nomeFormatado = formatarNomeVariavel(novaVariavel.nome);
    
    if (variaveisExistentes.some(v => v.nome === nomeFormatado)) {
      setErrors(prev => ({
        ...prev,
        nome: 'Já existe uma variável com este nome'
      }));
      return;
    }
    
    const novaVariavelCompleta = {
      ...novaVariavel,
      nome: nomeFormatado,
    };
    
    onAdd(novaVariavelCompleta);
    
    setNovaVariavel({
      nome: '',
      tipo: 'simples',
      subvariaveis: [],
      query: ''
    });
    
    setErrors({});
  };
  
  return (
    <Card className="mb-4">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Adicionar Nova Variável</h3>
      
      <div className="mb-3">
        <div className="mb-2 block">
          <Label htmlFor="nome-variavel" value="Nome da Variável*" />
        </div>
        <TextInput
          id="nome-variavel"
          name="nome"
          value={novaVariavel.nome}
          onChange={handleNovaVariavelChange}
          placeholder="Ex: cedente"
          color={errors.nome ? "failure" : undefined}
        />
        <HelperText color={errors.nome ? "failure" : undefined} className="mt-1">
          {errors.nome || "O nome será convertido para minúsculas e com underscores."}
        </HelperText>
      </div>
      
      <div className="mb-3">
        <Label value="Tipo de Variável*" className="mb-2 block"/>
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
                <Radio 
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
      
      {(novaVariavel.tipo === 'lista' || novaVariavel.tipo === 'tabela') && (
        <div className="mb-3 border-t border-gray-200 pt-3 mt-3">
          <div className="mb-3">
            <div className="mb-2 block">
              <Label htmlFor="query-variavel" value={novaVariavel.tipo === 'lista' ? 'Query da Lista*' : 'Query da Tabela*'} />
            </div>
            <Textarea
              id="query-variavel"
              name="query"
              value={novaVariavel.query}
              onChange={handleNovaVariavelChange}
              rows={3}
              color={errors.query ? "failure" : undefined}
              placeholder={novaVariavel.tipo === 'lista' 
                ? "SELECT * FROM devedores WHERE contrato_id = :id_contrato" 
                : "SELECT * FROM titulos WHERE contrato_id = :id_contrato"}
            />
            <HelperText color={errors.query ? "failure" : undefined} className="mt-1">
              {errors.query || `Esta query ${novaVariavel.tipo === 'lista' ? 'pode retornar múltiplas linhas, uma para cada item da lista' : 'retornará dados para criar uma tabela'}.`}
            </HelperText>
          </div>
        
          <div className="mb-2 block">
            <Label value={novaVariavel.tipo === 'lista' ? 'Campos da Lista*' : 'Colunas da Tabela*'} />
          </div>
          <div className="flex mb-2">
            <TextInput
              value={novaSubvariavel}
              onChange={(e) => setNovaSubvariavel(e.target.value)}
              placeholder={novaVariavel.tipo === 'lista' 
                ? "Ex: nome (ficará nome)" 
                : "Ex: valor (ficará valor)"}
              className="w-full"
            />
            <Button
              type="button"
              onClick={adicionarSubvariavel}
              color="light"
              className="ml-2"
            >
              <HiPlus className="mr-1 h-4 w-4" />
              Adicionar
            </Button>
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
      
      <Button
        type="button"
        onClick={addVariavel}
        disabled={!novaVariavel.nome.trim() || (
          (novaVariavel.tipo === 'lista' || novaVariavel.tipo === 'tabela') && 
          (novaVariavel.subvariaveis.length === 0 || !novaVariavel.query.trim())
        )}
        color="blue"
        className="w-full mt-2"
      >
        Adicionar Variável
      </Button>
    </Card>
  );
}

export default VariableForm;