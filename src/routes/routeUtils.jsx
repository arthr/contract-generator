import React from 'react';

/**
 * Utilitário para facilitar a criação de rotas dinâmicas
 * 
 * @param {string} baseUrl - URL base para a rota (ex: '/contratos')
 * @param {Object} params - Objeto contendo parâmetros para a rota
 * @returns {string} - URL formatada com os parâmetros inseridos
 * 
 * Exemplo:
 * createDynamicPath('/contratos', { id: '123', acao: 'editar' })
 * Resultado: '/contratos/123/editar'
 */
export const createDynamicPath = (baseUrl, params = {}) => {
  let path = baseUrl;
  
  // Adiciona cada parâmetro à URL
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      path += `/${value}`;
    }
  });
  
  return path;
};

/**
 * Gera uma definição de rota com parâmetros dinâmicos
 * 
 * @param {string} pathPattern - Padrão do caminho com parâmetros (ex: '/contratos/:id/:acao')
 * @param {React.Component} Component - Componente React a ser renderizado
 * @param {Object} options - Opções adicionais para a rota
 * @returns {Object} - Objeto de configuração da rota
 */
export const createDynamicRoute = (pathPattern, Component, options = {}) => ({
  path: pathPattern,
  element: <Component />,
  ...options
});

/**
 * Funções auxiliares para lazy loading
 * Útil para carregamento sob demanda de rotas em aplicações maiores
 */
export const lazyLoadRoute = (importFunc) => {
  const LazyComponent = React.lazy(importFunc);
  
  return (
    <React.Suspense fallback={<div>Carregando...</div>}>
      <LazyComponent />
    </React.Suspense>
  );
}; 