// Configuração da API base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Função para fazer requisições à API
 * @param {string} endpoint - Endpoint da API
 * @param {Object} options - Opções da requisição
 * @returns {Promise<any>} - Resposta da API
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Configuração padrão para requisições
  const defaultOptions = {
    headers: {
      'Accept': 'application/json',
      ...options.headers,
    },
  };
  
  // Mescla as opções padrão com as opções fornecidas
  const fetchOptions = {
    ...defaultOptions,
    ...options,
  };
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // Se a resposta não for OK (status 200-299), lança um erro
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Erro desconhecido na comunicação com o servidor',
      }));
      
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
    }
    
    // Retorna os dados da resposta
    return await response.json();
  } catch (error) {
    console.error('Erro na requisição à API:', error);
    throw error;
  }
};

/**
 * Serviço para upload de arquivos do modelo
 * @param {File} file - Arquivo a ser enviado
 * @param {string} filename - Nome do arquivo
 * @returns {Promise<Object>} - Resposta com a URL do arquivo
 */
export const uploadModeloTemplate = async (file, filename) => {
  const formData = new FormData();
  formData.append('file', file, filename);
  
  const options = {
    method: 'POST',
    headers: {
      // Não incluir 'Content-Type' aqui, pois o FormData define automaticamente
    },
    body: formData,
  };
  
  return fetchAPI('/modelos/upload', options);
};

/**
 * Serviço para criar um novo modelo de contrato
 * @param {Object} modeloData - Dados do modelo de contrato
 * @returns {Promise<Object>} - Modelo criado
 */
export const criarModelo = async (modeloData) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(modeloData),
  };
  
  return fetchAPI('/modelos', options);
};

/**
 * Serviço para obter todos os modelos de contrato
 * @returns {Promise<Array>} - Lista de modelos
 */
export const listarModelos = async () => {
  return fetchAPI('/modelos');
};

/**
 * Serviço para obter um modelo de contrato específico
 * @param {string|number} id - ID do modelo
 * @returns {Promise<Object>} - Modelo específico
 */
export const obterModelo = async (id) => {
  return fetchAPI(`/modelos/${id}`);
};

/**
 * Serviço para excluir um modelo de contrato
 * @param {string|number} id - ID do modelo
 * @returns {Promise<Object>} - Confirmação da exclusão
 */
export const excluirModelo = async (id) => {
  const options = {
    method: 'DELETE',
  };
  
  return fetchAPI(`/modelos/${id}`, options);
};

/**
 * Serviço para atualizar um modelo de contrato
 * @param {string|number} id - ID do modelo
 * @param {Object} modeloData - Dados atualizados do modelo
 * @returns {Promise<Object>} - Modelo atualizado
 */
export const atualizarModelo = async (id, modeloData) => {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(modeloData),
  };
  
  return fetchAPI(`/modelos/${id}`, options);
};

export default {
  uploadModeloTemplate,
  criarModelo,
  listarModelos,
  obterModelo,
  excluirModelo,
  atualizarModelo,
}; 