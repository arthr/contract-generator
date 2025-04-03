import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'flowbite-react';
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
        <Alert color="failure" className="mb-2">
          {error}
        </Alert>
      )}
      
      {/* Filtro de variáveis */}
      {variaveis.length > 0 && (
        <div className="flex space-x-2 mb-3">
          <Button 
            size="xs"
            color={filtroTipo === 'todos' ? 'blue' : 'light'}
            onClick={() => atualizarFiltro('todos')}
          >
            Todas
          </Button>
          <Button 
            size="xs"
            color={filtroTipo === 'simples' ? 'blue' : 'light'}
            onClick={() => atualizarFiltro('simples')}
          >
            Simples
          </Button>
          <Button 
            size="xs"
            color={filtroTipo === 'lista' ? 'blue' : 'light'}
            onClick={() => atualizarFiltro('lista')}
          >
            Listas
          </Button>
          <Button 
            size="xs"
            color={filtroTipo === 'tabela' ? 'blue' : 'light'}
            onClick={() => atualizarFiltro('tabela')}
          >
            Tabelas
          </Button>
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