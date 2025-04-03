import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obterModelo } from '../../../services/contractService';
import { Button, Card, Badge, Spinner, Alert } from 'flowbite-react';
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import { HiArrowLeft, HiPencil, HiDocumentDuplicate } from 'react-icons/hi';

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
                <Spinner size="xl" />
            </div>
        );
    }

    if (erro) {
        return (
            <Alert color="failure" className="my-4">
                <h3 className="font-bold">Erro</h3>
                <p>{erro}</p>
                <div className="mt-2">
                    <Button color="failure" onClick={carregarModelo}>
                        Tentar novamente
                    </Button>
                </div>
            </Alert>
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
                <Button color="light" onClick={() => navigate('/admin/modelos')}>
                    <HiArrowLeft className="mr-2 h-5 w-5" />
                    Voltar
                </Button>
                <Button as={Link} to={`/admin/modelos/editar/${modelo._id}`} color="blue">
                    <HiPencil className="mr-2 h-5 w-5" />
                    Editar
                </Button>
                <Button as={Link} to={`/admin/contratos/gerar/${modelo._id}`} color="success">
                    <HiDocumentDuplicate className="mr-2 h-5 w-5" />
                    Gerar Contrato
                </Button>
            </div>

            <Card>
                {/* Informações básicas */}
                <div className="mb-6">
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
                <div className="mb-6">
                    <h2 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">Query Principal</h2>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
                        <code>{modelo.queryPrincipal || 'Nenhuma query definida'}</code>
                    </div>
                </div>

                {/* Variáveis */}
                <div>
                    <h2 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">
                        Variáveis ({modelo.variaveis.length})
                    </h2>

                    {modelo.variaveis.length === 0 ? (
                        <p className="text-gray-500 italic">Nenhuma variável definida</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableHeadCell>Nome</TableHeadCell>
                                        <TableHeadCell>Tipo</TableHeadCell>
                                        <TableHeadCell>Subvariáveis</TableHeadCell>
                                        <TableHeadCell>Query</TableHeadCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="divide-y">
                                    {modelo.variaveis.map((variavel) => (
                                        <TableRow key={variavel._id} className="bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                            <TableCell className="font-medium">
                                                {variavel.nome}
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    color={
                                                        variavel.tipo === 'simples' ? 'info' :
                                                        variavel.tipo === 'lista' ? 'success' :
                                                        'purple'
                                                    }
                                                >
                                                    {variavel.tipo.charAt(0).toLowerCase() + variavel.tipo.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
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
                                            </TableCell>
                                            <TableCell>
                                                {variavel.query ? (
                                                    <div className="max-w-xs overflow-hidden">
                                                        <pre className="text-xs text-gray-600 truncate">{variavel.query}</pre>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">-</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default VisualizarModelo;