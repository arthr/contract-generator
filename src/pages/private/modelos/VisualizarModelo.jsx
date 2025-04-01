import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obterModelo } from '../../../services/contractService';

// Componentes
import FormHeader from './components/FormHeader';

function VisualizarModelo() {
    const { modeloId } = useParams();
    const navigate = useNavigate();

    const [modelo, setModelo] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const tiposContrato = {
        'prestacao-servicos': 'Prestação de Serviços',
        'compra-venda': 'Compra e Venda',
        'locacao': 'Locação',
        'parceria': 'Parceria',
        'confidencialidade': 'Confidencialidade'
    };

    useEffect(() => {
        carregarModelo();
    }, [modeloId]);

    const carregarModelo = async () => {
        setCarregando(true);
        try {
            const data = await obterModelo(modeloId);
            setModelo(data);
            setErro(null);
        } catch (error) {
            console.error('Erro ao carregar modelo:', error);
            setErro('Não foi possível carregar os detalhes do modelo. Por favor, tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (carregando) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4" role="alert">
                <p className="font-bold">Erro</p>
                <p>{erro}</p>
                <button
                    onClick={carregarModelo}
                    className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    if (!modelo) {
        return null;
    }

    return (
        <div>
            <FormHeader
                title={modelo.titulo}
                description="Detalhes do modelo de contrato"
            />

            <div className="flex justify-end mb-4 space-x-2">
                <button
                    onClick={() => navigate('/modelos')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    Voltar
                </button>
                <Link
                    to={`/modelos/editar/${modelo._id}`}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                >
                    Editar
                </Link>
                <Link
                    to={`/gerar-contrato/${modelo._id}`}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    Gerar Contrato
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                {/* Informações básicas */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Informações Básicas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tipo de Contrato</p>
                            <p className="text-base">{tiposContrato[modelo.tipo] || modelo.tipo}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Data de Criação</p>
                            <p className="text-base">{formatarData(modelo.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Caminho do Template</p>
                            <p className="text-base break-all">{modelo.caminhoTemplate}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Data de Modificação</p>
                            <p className="text-base">{formatarData(modelo.updatedAt)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Descrição</p>
                            <p className="text-base">{modelo.descricao}</p>
                        </div>
                    </div>
                </div>

                {/* Query principal */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Query Principal</h2>
                    <pre className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
                        <code>{modelo.queryPrincipal || 'Nenhuma query definida'}</code>
                    </pre>
                </div>

                {/* Variáveis */}
                <div>
                    <h2 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Variáveis ({modelo.variaveis.length})</h2>

                    {modelo.variaveis.length === 0 ? (
                        <p className="text-gray-500 italic">Nenhuma variável definida</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nome
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subvariáveis
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Query
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {modelo.variaveis.map((variavel) => (
                                        <tr key={variavel._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                                                {variavel.nome}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${variavel.tipo === 'simples'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : variavel.tipo === 'lista'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {variavel.tipo.charAt(0).toLowerCase() + variavel.tipo.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {variavel.subvariaveis && variavel.subvariaveis.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {variavel.subvariaveis.map((subvar, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded">
                                                                {subvar}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {variavel.query ? (
                                                    <div className="max-w-xs overflow-hidden">
                                                        <pre className="text-xs text-gray-600 truncate">{variavel.query}</pre>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VisualizarModelo; 