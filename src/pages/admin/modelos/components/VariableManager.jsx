import React, { useState, useEffect } from 'react';
import VariableForm from './VariableForm';
import VariableList from './VariableList';

function VariableManager({ variaveis, error, onAdd, onRemove }) {
  const [variaveisFiltradas, setVariaveisFiltradas] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  
  // Atualiza o filtro e aplica-o às variáveis
  const atualizarFiltro = (tipo) => {
    setFiltroTipo(tipo);
    
    if (tipo === 'todos') {
      setVariaveisFiltradas(variaveis);
    } else {
      setVariaveisFiltradas(variaveis.filter(v => v.tipo === tipo));
    }
  };
  
  // Atualiza as variáveis filtradas quando a lista de variáveis mudar
  useEffect(() => {
    atualizarFiltro(filtroTipo);
  }, [variaveis, filtroTipo]);
  
  return (
    <div className="md:col-span-2">
      <VariableForm 
        onAdd={onAdd} 
        variaveisExistentes={variaveis}
      />
      
      <label className="block text-gray-700 font-medium mb-2">
        Variáveis do Modelo*
      </label>
      
      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}
      
      {/* Filtro de variáveis */}
      {variaveis.length > 0 && (
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
      
      <VariableList 
        variaveis={variaveisFiltradas} 
        onRemove={onRemove} 
      />
      
      <p className="text-sm text-gray-500 mt-2">
        Adicione todas as variáveis que serão usadas no seu template do Word conforme o formato acima.
      </p>
    </div>
  );
}

export default VariableManager; 