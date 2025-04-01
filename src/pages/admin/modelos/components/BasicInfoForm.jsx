import React from 'react';

function BasicInfoForm({ formData, errors, tiposContrato, onChange }) {
  return (
    <>
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
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.descricao ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ex: Modelo para serviços de consultoria"
        />
        {errors.descricao && (
          <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>
        )}
      </div>
    </>
  );
}

export default BasicInfoForm; 