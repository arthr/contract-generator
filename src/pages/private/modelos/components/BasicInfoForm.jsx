import React from 'react';
import { TextInput, Label, Select, HelperText } from 'flowbite-react';

function BasicInfoForm({ formData, errors, tiposContrato, onChange }) {
  return (
    <>
      {/* Título do Modelo */}
      <div className="md:col-span-2">
        <div className="mb-2 block">
          <Label htmlFor="titulo" value="Título do Modelo*" />
        </div>
        <TextInput
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={onChange}
          color={errors.titulo ? "failure" : undefined}
          placeholder="Ex: Contrato de Prestação de Serviços"
        />
        <HelperText color={errors.titulo ? "failure" : undefined} className="mt-1">
          {errors.titulo}
        </HelperText>
      </div>
      
      {/* Tipo de Contrato */}
      <div>
        <div className="mb-2 block">
          <Label htmlFor="tipo" value="Tipo de Contrato*" />
        </div>
        <Select
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={onChange}
        >
          {tiposContrato.map(tipo => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.label}
            </option>
          ))}
        </Select>
      </div>
      
      {/* Descrição */}
      <div>
        <div className="mb-2 block">
          <Label htmlFor="descricao" value="Descrição*" />
        </div>
        <TextInput
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={onChange}
          color={errors.descricao ? "failure" : undefined}
          placeholder="Ex: Modelo para serviços de consultoria"
        />
        <HelperText color={errors.descricao ? "failure" : undefined} className="mt-1">
          {errors.descricao}
        </HelperText>
      </div>
    </>
  );
}

export default BasicInfoForm;