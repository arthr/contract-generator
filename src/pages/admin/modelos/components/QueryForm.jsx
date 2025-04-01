import React from 'react';

function QueryForm({ query, error, onChange }) {
  return (
    <div className="md:col-span-2">
      <label htmlFor="queryPrincipal" className="block text-gray-700 font-medium mb-2">
        Query Principal*
      </label>
      <div className="relative">
        <textarea
          id="queryPrincipal"
          name="queryPrincipal"
          value={query}
          onChange={onChange}
          rows="4"
          className={`w-full px-4 py-2 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="SELECT * FROM contratos WHERE id = :id_contrato"
        ></textarea>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      <p className="text-sm text-gray-500 mt-1">
        Esta query deve retornar uma única linha, fornecendo dados para todas as variáveis simples.
        Use parâmetros com prefixo ":" (ex: :id_contrato) que serão substituídos durante a geração.
      </p>
    </div>
  );
}

export default QueryForm; 