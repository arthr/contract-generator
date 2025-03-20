import React, { useState } from 'react';

function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
    setFormData({ nome: '', email: '', mensagem: '' });
  };

  return (
    <div className="py-5">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Entre em Contato</h2>
      <p className="text-lg mb-6">
        Tem dúvidas ou sugestões? Preencha o formulário abaixo e entraremos em contato o mais breve possível.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="mb-4">
              <label htmlFor="nome" className="block text-gray-700 font-medium mb-2">Nome</label>
              <input 
                type="text" 
                id="nome" 
                name="nome" 
                value={formData.nome}
                onChange={handleChange}
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">E-mail</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="mensagem" className="block text-gray-700 font-medium mb-2">Mensagem</label>
              <textarea 
                id="mensagem" 
                name="mensagem" 
                rows="5" 
                value={formData.mensagem}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
        
        <div className="bg-gray-100 p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Informações de Contato</h3>
          <div className="space-y-3">
            <p className="flex items-start">
              <span className="font-semibold mr-2">Email:</span> 
              <span>contato@contractgenerator.com.br</span>
            </p>
            <p className="flex items-start">
              <span className="font-semibold mr-2">Telefone:</span> 
              <span>(11) 1234-5678</span>
            </p>
            <p className="flex items-start">
              <span className="font-semibold mr-2">Endereço:</span> 
              <span>Av. Paulista, 1234 - São Paulo, SP</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contato; 