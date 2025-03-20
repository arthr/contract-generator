import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function GerarContrato() {
  const { modeloId } = useParams();
  const navigate = useNavigate();
  
  const [modelo, setModelo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [variaveis, setVariaveis] = useState({});
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(false);
  const [contratoGerado, setContratoGerado] = useState('');
  
  // Simulando a obtenção de dados do modelo
  useEffect(() => {
    // Em um caso real, isso seria uma chamada de API
    const fetchModelo = () => {
      setLoading(true);
      
      // Simulando uma chamada de API
      setTimeout(() => {
        // Dados simulados para o modelo selecionado
        const modelosSimulados = [
          {
            id: '1',
            titulo: 'Contrato de Prestação de Serviços',
            tipo: 'prestacao-servicos',
            descricao: 'Modelo padrão para prestação de serviços entre empresas ou autônomos.',
            variaveis: ['NOME_CONTRATANTE', 'NOME_CONTRATADO', 'CNPJ_CONTRATANTE', 'CNPJ_CONTRATADO', 'VALOR', 'PRAZO', 'DESCRICAO_SERVICO'],
            conteudo: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: {{NOME_CONTRATANTE}}, pessoa jurídica inscrita no CNPJ sob o número {{CNPJ_CONTRATANTE}}.

CONTRATADO: {{NOME_CONTRATADO}}, pessoa jurídica inscrita no CNPJ sob o número {{CNPJ_CONTRATADO}}.

OBJETO DO CONTRATO:
O presente contrato tem como objeto a prestação dos seguintes serviços pelo CONTRATADO:
{{DESCRICAO_SERVICO}}

VALOR E PAGAMENTO:
Pelos serviços prestados, a CONTRATANTE pagará ao CONTRATADO o valor de {{VALOR}}.

PRAZO:
O presente contrato terá vigência de {{PRAZO}}, iniciando-se na data de sua assinatura.

E, por estarem justas e contratadas, as partes assinam o presente instrumento em duas vias de igual teor e forma.

Local e data

_______________________
CONTRATANTE

_______________________
CONTRATADO`
          },
          {
            id: '2',
            titulo: 'Contrato de Locação Comercial',
            tipo: 'locacao',
            descricao: 'Modelo para locação de imóveis comerciais.',
            variaveis: ['NOME_LOCADOR', 'NOME_LOCATARIO', 'ENDERECO_IMOVEL', 'VALOR_ALUGUEL', 'PRAZO_CONTRATO', 'INDICE_REAJUSTE'],
            conteudo: `CONTRATO DE LOCAÇÃO COMERCIAL

LOCADOR: {{NOME_LOCADOR}}
LOCATÁRIO: {{NOME_LOCATARIO}}

OBJETO: O LOCADOR cede para locação comercial ao LOCATÁRIO o imóvel situado no endereço {{ENDERECO_IMOVEL}}.

VALOR: O valor mensal do aluguel é de {{VALOR_ALUGUEL}}, a ser pago até o dia 5 de cada mês.

PRAZO: A presente locação terá o prazo de {{PRAZO_CONTRATO}}.

REAJUSTE: O valor do aluguel será reajustado anualmente pelo índice {{INDICE_REAJUSTE}}.

E, por estarem justas e contratadas, as partes assinam o presente instrumento.

Local e Data

_______________________
LOCADOR

_______________________
LOCATÁRIO`
          },
          {
            id: '3',
            titulo: 'Acordo de Confidencialidade',
            tipo: 'confidencialidade',
            descricao: 'Modelo de NDA para proteger informações confidenciais entre partes.',
            variaveis: ['PARTE_REVELADORA', 'PARTE_RECEPTORA', 'OBJETO_CONFIDENCIALIDADE', 'PRAZO_CONFIDENCIALIDADE', 'PENALIDADE'],
            conteudo: `ACORDO DE CONFIDENCIALIDADE (NDA)

PARTE REVELADORA: {{PARTE_REVELADORA}}
PARTE RECEPTORA: {{PARTE_RECEPTORA}}

OBJETO: Este acordo visa proteger informações confidenciais relacionadas a {{OBJETO_CONFIDENCIALIDADE}}.

A PARTE RECEPTORA compromete-se a manter total sigilo sobre as informações confidenciais compartilhadas pela PARTE REVELADORA.

PRAZO: As obrigações de confidencialidade permanecerão em vigor por {{PRAZO_CONFIDENCIALIDADE}} após o término deste acordo.

PENALIDADE: Em caso de violação deste acordo, a parte infratora estará sujeita a {{PENALIDADE}}.

Por estarem assim justas e contratadas, as partes assinam o presente acordo.

Local e Data

_______________________
PARTE REVELADORA

_______________________
PARTE RECEPTORA`
          },
        ];
        
        const modeloEncontrado = modelosSimulados.find(m => m.id === modeloId);
        
        if (modeloEncontrado) {
          setModelo(modeloEncontrado);
          
          // Inicializa as variáveis com valores vazios
          const variaveisIniciais = {};
          modeloEncontrado.variaveis.forEach(variavel => {
            variaveisIniciais[variavel] = '';
          });
          
          setVariaveis(variaveisIniciais);
        } else {
          // Em caso de modelo não encontrado
          alert('Modelo não encontrado');
          navigate('/modelos');
        }
        
        setLoading(false);
      }, 500);
    };
    
    fetchModelo();
  }, [modeloId, navigate]);
  
  const handleChange = (variavel, valor) => {
    setVariaveis(prev => ({
      ...prev,
      [variavel]: valor
    }));
    
    // Limpa o erro quando o usuário começa a digitar
    if (errors[variavel]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[variavel];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    // Verifica se todas as variáveis foram preenchidas
    modelo.variaveis.forEach(variavel => {
      if (!variaveis[variavel] || variaveis[variavel].trim() === '') {
        newErrors[variavel] = `O campo ${variavel.replace(/_/g, ' ').toLowerCase()} é obrigatório`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const gerarPreview = () => {
    if (validate()) {
      let conteudoFinal = modelo.conteudo;
      
      // Substitui as variáveis no texto
      Object.entries(variaveis).forEach(([chave, valor]) => {
        const regex = new RegExp(`{{${chave}}}`, 'g');
        conteudoFinal = conteudoFinal.replace(regex, valor);
      });
      
      setContratoGerado(conteudoFinal);
      setPreview(true);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (preview) {
      // Aqui faria a integração com uma API para salvar o contrato gerado
      alert('Contrato gerado com sucesso!');
      navigate('/modelos');
    } else {
      gerarPreview();
    }
  };
  
  const voltarAoFormulario = () => {
    setPreview(false);
  };
  
  if (loading) {
    return (
      <div className="py-6 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-60 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {preview ? 'Pré-visualização do Contrato' : `Gerar Contrato: ${modelo.titulo}`}
        </h2>
        <p className="text-gray-600 mt-2">
          {preview 
            ? 'Confira o documento gerado antes de finalizar.' 
            : 'Preencha as variáveis do modelo para gerar o contrato.'}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        {!preview ? (
          // Formulário para preencher as variáveis
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {modelo.variaveis.map((variavel) => (
                <div key={variavel} className="mb-2">
                  <label htmlFor={variavel} className="block text-gray-700 font-medium mb-2">
                    {variavel.replace(/_/g, ' ').toLowerCase()}*
                  </label>
                  <input
                    type="text"
                    id={variavel}
                    value={variaveis[variavel] || ''}
                    onChange={(e) => handleChange(variavel, e.target.value)}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[variavel] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors[variavel] && (
                    <p className="text-red-500 text-sm mt-1">{errors[variavel]}</p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/modelos')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Gerar Pré-visualização
              </button>
            </div>
          </form>
        ) : (
          // Pré-visualização do contrato gerado
          <div>
            <div className="border border-gray-300 rounded-md p-5 mb-6 bg-gray-50">
              <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                {contratoGerado}
              </pre>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={voltarAoFormulario}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Voltar e Editar
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Imprimir
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Baixar Contrato
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GerarContrato; 