import React from 'react';

function Sobre() {
  return (
    <div className="py-5">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Sobre o Contract Generator</h2>
      <p className="text-lg mb-4">
        O Contract Generator é uma ferramenta desenvolvida para simplificar a criação e 
        gerenciamento de contratos para profissionais e empresas de todos os tamanhos.
      </p>
      <p className="text-lg mb-6">
        Nossa missão é tornar a geração de documentos legais mais acessível e eficiente,
        permitindo que você se concentre no que realmente importa para o seu negócio.
      </p>
      
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Nossa História</h3>
      <p className="text-lg mb-6">
        Fundado em 2023, o Contract Generator nasceu da necessidade de simplificar
        processos burocráticos que consomem tempo precioso de empreendedores e profissionais.
      </p>
      
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Equipe</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold text-gray-800 mb-1">João Silva</h4>
          <p className="text-gray-700">CEO & Fundador</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold text-gray-800 mb-1">Maria Oliveira</h4>
          <p className="text-gray-700">Diretora de Tecnologia</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold text-gray-800 mb-1">Carlos Santos</h4>
          <p className="text-gray-700">Consultor Jurídico</p>
        </div>
      </div>
    </div>
  );
}

export default Sobre; 