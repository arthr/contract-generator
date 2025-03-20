import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NovoContrato() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'prestacao-servicos',
    parteA: '',
    parteB: '',
    valor: '',
    dataInicio: '',
    dataFim: '',
    descricao: ''
  });
  
  const [errors, setErrors] = useState({});
  
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
    
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.titulo.trim())
      newErrors.titulo = 'Título é obrigatório';
      
    if (!formData.parteA.trim())
      newErrors.parteA = 'Parte A é obrigatória';
      
    if (!formData.parteB.trim())
      newErrors.parteB = 'Parte B é obrigatória';
      
    if (!formData.valor.trim())
      newErrors.valor = 'Valor é obrigatório';
      
    if (!formData.dataInicio.trim())
      newErrors.dataInicio = 'Data de início é obrigatória';
      
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Aqui faríamos a integração com uma API para salvar o contrato
      console.log('Formulário válido, dados:', formData);
      
      // Simula um sucesso e redireciona (em um caso real, isso seria feito após o retorno da API)
      alert('Contrato criado com sucesso!');
      navigate('/contratos'); // Redireciona para a lista de contratos
    }
  };
  
  const handleCancel = () => {
    if (confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
      navigate('/contratos');
    }
  };
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Novo Contrato</h2>
        <p className="text-gray-600 mt-2">Preencha o formulário abaixo para criar um novo contrato.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título do Contrato */}
          <div className="md:col-span-2">
            <label htmlFor="titulo" className="block text-gray-700 font-medium mb-2">
              Título do Contrato*
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
              placeholder="Ex: Contrato de prestação de serviços de desenvolvimento"
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
          
          {/* Valor do Contrato */}
          <div>
            <label htmlFor="valor" className="block text-gray-700 font-medium mb-2">
              Valor do Contrato (R$)*
            </label>
            <input
              type="text"
              id="valor"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.valor ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 5000,00"
            />
            {errors.valor && (
              <p className="text-red-500 text-sm mt-1">{errors.valor}</p>
            )}
          </div>
          
          {/* Parte A */}
          <div>
            <label htmlFor="parteA" className="block text-gray-700 font-medium mb-2">
              Parte A (Contratante)*
            </label>
            <input
              type="text"
              id="parteA"
              name="parteA"
              value={formData.parteA}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.parteA ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nome completo ou razão social"
            />
            {errors.parteA && (
              <p className="text-red-500 text-sm mt-1">{errors.parteA}</p>
            )}
          </div>
          
          {/* Parte B */}
          <div>
            <label htmlFor="parteB" className="block text-gray-700 font-medium mb-2">
              Parte B (Contratada)*
            </label>
            <input
              type="text"
              id="parteB"
              name="parteB"
              value={formData.parteB}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.parteB ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nome completo ou razão social"
            />
            {errors.parteB && (
              <p className="text-red-500 text-sm mt-1">{errors.parteB}</p>
            )}
          </div>
          
          {/* Data de Início */}
          <div>
            <label htmlFor="dataInicio" className="block text-gray-700 font-medium mb-2">
              Data de Início*
            </label>
            <input
              type="date"
              id="dataInicio"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dataInicio ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dataInicio && (
              <p className="text-red-500 text-sm mt-1">{errors.dataInicio}</p>
            )}
          </div>
          
          {/* Data de Fim */}
          <div>
            <label htmlFor="dataFim" className="block text-gray-700 font-medium mb-2">
              Data de Fim
            </label>
            <input
              type="date"
              id="dataFim"
              name="dataFim"
              value={formData.dataFim}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-gray-500 text-sm mt-1">Opcional para contratos sem prazo definido</p>
          </div>
          
          {/* Descrição/Objeto */}
          <div className="md:col-span-2">
            <label htmlFor="descricao" className="block text-gray-700 font-medium mb-2">
              Descrição / Objeto do Contrato
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva o objeto ou finalidade deste contrato..."
            ></textarea>
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
            Criar Contrato
          </button>
        </div>
      </form>
    </div>
  );
}

export default NovoContrato; 