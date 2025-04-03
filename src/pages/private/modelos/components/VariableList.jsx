import React from 'react';
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button, Badge } from 'flowbite-react';
import { HiTrash } from 'react-icons/hi';

function VariableList({ variaveis, onRemove }) {
  // Função para formatar como a variável aparece no documento
  const obterFormatoExibicao = (variavel) => {
    if (variavel.tipo === 'simples') {
      return `{principal.${variavel.nome}}`;
    } else if (variavel.tipo === 'lista') {
      return `{#${variavel.nome}} ... {/${variavel.nome}}`;
    } else if (variavel.tipo === 'tabela') {
      return `{#${variavel.nome}}{carteira}{valor}{vencimento}{status}{/${variavel.nome}}`;
    }
    return '';
  };
  
  return (
    <>
      {variaveis.length > 0 ? (
        <div className="overflow-x-auto">
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Nome</TableHeadCell>
                <TableHeadCell>Tipo</TableHeadCell>
                <TableHeadCell>Formato no Documento</TableHeadCell>
                <TableHeadCell>Ações</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {variaveis.map((variavel, index) => (
                <TableRow key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
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
                              {variavel.tipo === 'lista' ? `${subvar}` : subvar}
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
                  </TableCell>
                  <TableCell>
                    <Badge 
                      color={
                        variavel.tipo === 'simples' ? 'success' :
                        variavel.tipo === 'lista' ? 'info' :
                        'blue'
                      }
                    >
                      {variavel.tipo === 'simples' ? 'Simples' :
                       variavel.tipo === 'lista' ? 'Lista' : 'Tabela'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {variavel.tipo !== 'lista' ? obterFormatoExibicao(variavel) : null}
                    
                    {variavel.tipo === 'lista' && (
                      <div className="mt-1">
                        <div className="text-gray-500">
                          <p>Para obter campos da lista: <strong>{'{#' + variavel.nome + '}'}</strong></p>
                          {variavel.subvariaveis.map((subvar, idx) => (
                            <div key={idx}>{'{' + subvar + '}'}</div>
                          ))}
                          <p><strong>{'{/' + variavel.nome + '}'}</strong></p>
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      color="failure"
                      size="xs"
                      pill
                      onClick={() => onRemove(index)}
                    >
                      <HiTrash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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