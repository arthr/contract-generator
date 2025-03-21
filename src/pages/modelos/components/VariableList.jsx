import React from 'react';

function VariableList({ variaveis, onRemove }) {
  // Função para formatar como a variável aparece no documento
  const obterFormatoExibicao = (variavel) => {
    if (variavel.tipo === 'simples') {
      return `{{${variavel.nome}}}`;
    } else if (variavel.tipo === 'lista') {
      return `{{L:${variavel.nome}}}`;
    } else if (variavel.tipo === 'tabela') {
      return `{{T:${variavel.nome}}}`;
    }
    return '';
  };
  
  return (
    <>
      {variaveis.length > 0 ? (
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Nome</th>
                <th className="px-4 py-2 font-medium">Tipo</th>
                <th className="px-4 py-2 font-medium">Formato no Documento</th>
                <th className="px-4 py-2 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {variaveis.map((variavel, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium">{variavel.nome}</span>
                    
                    {/* Mostra subvariáveis se existirem */}
                    {(variavel.tipo === 'lista' || variavel.tipo === 'tabela') && variavel.subvariaveis.length > 0 && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-500 block mb-1">
                          {variavel.tipo === 'lista' ? 'Campos:' : 'Colunas:'}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {variavel.subvariaveis.map((subvar, idx) => (
                            <span key={idx} className="inline-block bg-gray-100 px-2 py-1 rounded text-xs">
                              {variavel.tipo === 'lista' ? `${variavel.nome}.${subvar}` : subvar}
                            </span>
                          ))}
                        </div>
                        
                        {/* Exibe a query associada */}
                        {variavel.query && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-500 block mb-1">Query:</span>
                            <div className="bg-gray-50 p-2 rounded text-xs font-mono border border-gray-200 max-h-20 overflow-y-auto">
                              {variavel.query}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      variavel.tipo === 'simples' ? 'bg-green-100 text-green-800' :
                      variavel.tipo === 'lista' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {variavel.tipo === 'simples' ? 'Simples' :
                       variavel.tipo === 'lista' ? 'Lista' : 'Tabela'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {obterFormatoExibicao(variavel)}
                    
                    {variavel.tipo === 'lista' && (
                      <div className="mt-1">
                        <div className="text-gray-500">
                          <p>Para obter campos da lista:</p>
                          {variavel.subvariaveis.map((subvar, idx) => (
                            <div key={idx}>{'{{' + variavel.nome + '.' + subvar + '}}'}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onRemove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 border border-gray-300 rounded-md bg-gray-50">
          <p className="text-gray-500">Nenhuma variável adicionada ainda.</p>
        </div>
      )}
    </>
  );
}

export default VariableList; 